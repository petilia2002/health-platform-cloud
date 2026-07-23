from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func
from sqlalchemy.orm import selectinload
from typing import Optional
from datetime import date

from app.exceptions.apiError import ApiError
from app.db.transaction import transactional
from app.dtos.predictionDto import PredictionDtoBuilder
from app.models.models import (
    Patient,
    Sample,
    SampleResult,
    Analyte,
    Prediction,
    PredictionResult,
    AccessPrediction,
    User,
    Request,
    RequestStatus,
    Doctor,
)
from app.services.modelService import ModelService
from app.utils.user_processing import calculate_age, calculate_gender

# LOINC-коды целевых показателей, которые прогнозируются
target_param_codes = {
    "20567-4",  # ферритин
    "4548-4",  # hba1c
    "18261-8",  # лпнп
    "14933-6",  # мочевая кислота
}


class PredictionService:
    @staticmethod
    async def get_predictions(
        payload: dict,
        page: Optional[int],
        limit: Optional[int],
        start_date: Optional[date],
        end_date: Optional[date],
        db: AsyncSession,
    ):
        if not payload or not payload.get("id"):
            raise ApiError.BadRequest(
                f"Не удалось идентифицировать текущего пользователя"
            )

        user_id = payload["id"]

        patient_response = await db.execute(
            select(Patient).where(Patient.user_id == user_id)
        )
        patient = patient_response.scalar_one_or_none()
        if not patient:
            raise ApiError.BadRequest(f"Такого пациента не существует")

        last_access_subquery = (
            select(
                AccessPrediction.prediction_id,
                func.max(AccessPrediction.id).label("latest_access_id"),
            )
            .group_by(AccessPrediction.prediction_id)
            .subquery()
        )

        stmt = (
            select(Prediction, AccessPrediction)
            .join(Sample, Prediction.sample_id == Sample.id)
            .join(Patient, Sample.patient_id == Patient.id)
            .outerjoin(
                last_access_subquery,
                last_access_subquery.c.prediction_id == Prediction.id,
            )
            .outerjoin(
                AccessPrediction,
                AccessPrediction.id == last_access_subquery.c.latest_access_id,
            )
            .outerjoin(Request, Request.id == AccessPrediction.request_id)
            .outerjoin(RequestStatus, RequestStatus.id == Request.status_id)
            .where(Patient.id == patient.id)
            .options(
                selectinload(Prediction.prediction_results).selectinload(
                    PredictionResult.analyte
                ),
                selectinload(AccessPrediction.request).selectinload(Request.status),
                selectinload(AccessPrediction.request)
                .selectinload(Request.doctor)
                .selectinload(Doctor.user),
            )
            .order_by(Prediction.creation_date.desc())
        )

        if start_date:
            stmt = stmt.where(Prediction.creation_date >= start_date)

        if end_date:
            stmt = stmt.where(Prediction.creation_date <= end_date)

        if page and limit:
            offset = limit * (page - 1)
            stmt = stmt.offset(offset).limit(limit)

        response = await db.execute(stmt)
        rows = response.all()

        response_dtos = [
            PredictionDtoBuilder.build_from_access_prediction(pred, access).to_dict()
            for pred, access in rows
        ]
        return response_dtos

    @staticmethod
    async def get_prediction_by_id(
        user_payload: dict, prediction_id: int, db: AsyncSession
    ):
        result = await db.execute(
            select(Prediction, AccessPrediction)
            .select_from(Prediction)
            .outerjoin(
                AccessPrediction,
                AccessPrediction.prediction_id == Prediction.id,
            )
            .where(Prediction.id == prediction_id)
            .order_by(AccessPrediction.update_date.desc())
            .limit(1)
            .options(
                selectinload(Prediction.prediction_results).selectinload(
                    PredictionResult.analyte
                ),
                selectinload(AccessPrediction.request)
                .selectinload(Request.doctor)
                .selectinload(Doctor.user),
                selectinload(AccessPrediction.request).selectinload(Request.status),
                selectinload(Prediction.sample).selectinload(Sample.patient),
            )
        )
        rows = result.first()
        if not rows:
            raise ApiError.BadRequest(f"Прогноз с id={prediction_id} не существует")

        prediction, access = rows

        if prediction.sample.patient.user_id != user_payload["id"]:
            raise ApiError.BadRequest(
                f"У вас нет прав доступа к прогнозу с id={prediction_id}"
            )

        response_dto = PredictionDtoBuilder.build_from_access_prediction(
            prediction, access
        )
        return response_dto.to_dict()

    @staticmethod
    async def create_prediction(payload: dict, sample_id: int, db: AsyncSession):
        if not (payload and payload.get("id")):
            raise ApiError.BadRequest(
                f"Не удалось идентифицировать текущего пользователя"
            )

        user_id = payload["id"]
        user = await db.scalar(
            select(User).options(selectinload(User.gender)).where(User.id == user_id)
        )
        if not user:
            raise ApiError.BadRequest(f"Пользователь не найден")

        gender = calculate_gender(user.gender.name)
        age = calculate_age(user.birth_date)

        response = await db.execute(
            select(Sample)
            .options(
                selectinload(Sample.sample_results).selectinload(SampleResult.analyte)
            )
            .where(Sample.id == sample_id)
        )
        sample = response.scalar_one_or_none()
        if not sample:
            raise ApiError.BadRequest(f"Образец крови с id = {sample_id} не найден")

        sampleNo = str(sample_id).zfill(6)

        params = {r.analyte.loinc_code: str(r.value) for r in sample.sample_results}
        duplicates = [k for k, v in params.items() if k in target_param_codes]
        if len(duplicates) == 4:
            raise ApiError.BadRequest(f"У вас уже есть все прогнозируемые показатели")

        params.update({"GENDER": gender, "AGE": age})
        params = {k: v for k, v in params.items() if k not in target_param_codes}

        api_response = ModelService.create_prediction_with_ulm(sampleNo, params)
        if api_response["status"] == "failed":
            raise ApiError.InternalServerError(api_response["message"])

        api_results = [
            {
                "title": r["title"],
                "analyte": r["analyte"],
                "conclusion": r["conclusion"],
                "probability": float(r["result"]),
            }
            for r in api_response["data"][0]["results"]
        ]

        new_prediction = Prediction(sample_id=sample_id)
        async with transactional(db):
            db.add(new_prediction)
        await db.refresh(new_prediction)

        analyte_names = [r["analyte"] for r in api_results]
        conditions = [Analyte.name.ilike(f"%{name}%") for name in analyte_names]
        db_analytes = (
            (await db.execute(select(Analyte).where(or_(*conditions)))).scalars().all()
        )

        analytes_map = {a.name.lower(): a for a in db_analytes}

        predictions = []
        for r in api_results:
            analyte = next(
                (a for name, a in analytes_map.items() if r["analyte"].lower() in name),
                None,
            )
            if not analyte or analyte.loinc_code in duplicates:
                continue
            prediction = PredictionResult(
                title=r["title"],
                conclusion=r["conclusion"],
                probability=r["probability"],
                prediction_id=new_prediction.id,
                analyte_id=analyte.id,
            )
            predictions.append(prediction)

        async with transactional(db):
            db.add_all(predictions)

        return await PredictionService.get_prediction_by_id(
            payload, new_prediction.id, db
        )

    @staticmethod
    async def delete_prediction(prediction_id: int, db: AsyncSession):
        response = await db.execute(
            select(Prediction)
            .options(
                selectinload(Prediction.prediction_results).selectinload(
                    PredictionResult.analyte
                )
            )
            .where(Prediction.id == prediction_id)
        )
        prediction = response.scalar_one_or_none()
        if not prediction:
            raise ApiError.BadRequest(f"Прогноз с id = {prediction_id} не существует")

        deleted_prediction = PredictionDtoBuilder.build_from_access_prediction(
            prediction
        ).to_dict()

        async with transactional(db):
            await db.delete(prediction)

        return deleted_prediction
