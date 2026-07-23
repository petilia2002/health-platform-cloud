import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
from typing import Optional
from datetime import datetime

from app.db.transaction import transactional
from app.exceptions.apiError import ApiError
from app.models.models import (
    Patient,
    Doctor,
    RequestStatus,
    Request,
    AccessPrediction,
    Sample,
    SampleResult,
    Prediction,
    PredictionResult,
)
from app.dtos.predictionDto import PredictionDtoBuilder
from app.dtos.sampleDto import SampleDtoBuilder
from app.dtos.requestDto import PatientRequestDto, DoctorRequestDto, AdminRequestDto

dto_mapping = {
    "Пациент": PatientRequestDto,
    "Врач": DoctorRequestDto,
    "Администратор": AdminRequestDto,
}


class RequestService:
    @staticmethod
    async def get_requests(user_payload: dict, status: Optional[str], db: AsyncSession):
        if not user_payload or not user_payload.get("id"):
            raise ApiError.BadRequest("Не удалось идентифицировать пользователя")

        user_id, role = user_payload["id"], user_payload["role"]

        stmt = (
            select(Request)
            .options(
                selectinload(Request.status),
                selectinload(Request.doctor).selectinload(Doctor.user),
                selectinload(Request.patient).selectinload(Patient.user),
            )
            .join(Request.status)
            .order_by(Request.creation_date.desc())
        )

        if role == "Пациент":
            stmt = stmt.join(Request.patient).where(Patient.user_id == user_id)
        elif role == "Врач":
            stmt = stmt.join(Request.doctor).where(Doctor.user_id == user_id)

        if status:
            stmt = stmt.where(RequestStatus.name == status)

        result = await db.execute(stmt)
        requests = result.scalars().all()

        dto_class = dto_mapping.get(role, AdminRequestDto)
        return [dto_class(request) for request in requests]

    @staticmethod
    async def get_request(user_payload: dict, request_id: int, db: AsyncSession):
        if not user_payload or not user_payload.get("id"):
            raise ApiError.BadRequest("Не удалось идентифицировать пользователя")

        user_id, role = user_payload["id"], user_payload["role"]

        request = await db.scalar(
            select(Request)
            .options(
                selectinload(Request.status),
                selectinload(Request.doctor).selectinload(Doctor.user),
                selectinload(Request.patient).selectinload(Patient.user),
            )
            .where(Request.id == request_id)
        )

        if not request:
            raise ApiError.BadRequest(f"Заявка с id = {request_id} не найдена")

        if role == "Пациент":
            if request.patient.user_id != user_id:
                raise ApiError.AccessDeniedError(
                    "У вас нет прав для доступа к этой заявке"
                )
        elif role == "Врач":
            if request.doctor.user_id != user_id:
                raise ApiError.AccessDeniedError(
                    "У вас нет прав для доступа к этой заявке"
                )
        elif role == "Администратор":
            pass
        else:
            raise ApiError.AccessDeniedError("Неизвестная роль пользователя")

        dto_class = dto_mapping.get(role, AdminRequestDto)
        return dto_class(request)

    @staticmethod
    async def create_request(
        user_payload: dict,
        user_data: dict,
        db: AsyncSession,
    ):
        if not user_payload or not user_payload.get("id"):
            raise ApiError.BadRequest("Не удалось идентифицировать пользователя")

        user_id = user_payload["id"]
        patient_stmt = select(Patient.id).where(Patient.user_id == user_id)
        status_stmt = select(RequestStatus.id).where(RequestStatus.name == "Ожидание")
        patient_id, status_id = await asyncio.gather(
            db.scalar(patient_stmt), db.scalar(status_stmt)
        )

        doctor_id = user_data["doctor_id"]
        existing_request = await db.scalar(
            select(Request.id)
            .join(Request.status)
            .where(
                Request.patient_id == patient_id,
                Request.doctor_id == doctor_id,
                RequestStatus.name.in_(["Ожидание", "Активный"]),
            )
        )

        if existing_request:
            raise ApiError.BadRequest("У вас уже есть заявка к этому врачу")

        request = Request(
            doctor_id=doctor_id, patient_id=patient_id, status_id=status_id
        )
        async with transactional(db):
            db.add(request)

        return await RequestService.get_request(user_payload, request.id, db)

    @staticmethod
    async def update_request(
        user_payload: dict, request_id: int, user_data: dict, db: AsyncSession
    ):
        if not user_payload or not user_payload.get("id"):
            raise ApiError.BadRequest("Не удалось идентифицировать пользователя")

        user_id, role = user_payload["id"], user_payload["role"]
        request = await db.scalar(
            select(Request)
            .where(Request.id == request_id)
            .options(
                selectinload(Request.status),
                selectinload(Request.doctor).selectinload(Doctor.user),
                selectinload(Request.patient).selectinload(Patient.user),
            )
        )  # возвращает: одно значение (первый столбец первой строки) или None
        if not request:
            raise ApiError.BadRequest(f"Заявка с id = {request_id} не найдена")

        if role == "Пациент":
            if request.patient.user_id != user_id:
                raise ApiError.AccessDeniedError(
                    "У вас нет прав для обновления этой заявки"
                )
        elif role == "Врач":
            if request.doctor.user_id != user_id:
                raise ApiError.AccessDeniedError(
                    "У вас нет прав для обновления этой заявки"
                )
        elif role == "Администратор":
            pass
        else:
            raise ApiError.AccessDeniedError("Неизвестная роль пользователя")

        status_id = await db.scalar(
            select(RequestStatus.id).where(RequestStatus.name == user_data["status"])
        )  # возвращает либо целое число либо None
        if status_id is None:
            raise ApiError.BadRequest(f"Статус '{user_data["status"]}' не найден")

        request.status_id = status_id
        async with transactional(db):
            db.add(request)
        await db.refresh(request)

        return await RequestService.get_request(user_payload, request.id, db)

    @staticmethod
    async def get_prediction_by_id(prediction_id: int, db: AsyncSession):
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
            )
        )
        rows = result.first()
        if not rows:
            raise ApiError.BadRequest(f"Прогноз с id = {prediction_id} не существует")

        prediction, access = rows
        response_dto = PredictionDtoBuilder.build_from_access_prediction(
            prediction, access
        )
        return response_dto.to_dict()

    @staticmethod
    async def check_patient_access(
        user_id: int, prediction_id: int, request_id: int, db: AsyncSession
    ):
        # Ищем пациента в системе, проверяем его права:
        query = (
            select(
                Patient.id.label("patient_id"),
                Prediction.id.label("prediction_id"),
                Request.id.label("request_id"),
            )
            .select_from(Patient)
            .join(Sample, Sample.patient_id == Patient.id)
            .join(Prediction, Prediction.sample_id == Sample.id)
            .join(Request, Request.patient_id == Patient.id)
            .join(RequestStatus, RequestStatus.id == Request.status_id)
            .where(
                Patient.user_id == user_id,
                Prediction.id == prediction_id,
                Request.id == request_id,
                RequestStatus.name == "Активный",
            )
        )
        result = await db.execute(query)
        access_data = result.first()

        if not access_data:
            raise ApiError.BadRequest(
                "Доступ запрещен: сущности не найдены или не принадлежат пользователю"
            )

        return access_data

    @staticmethod
    async def create_access_prediction(
        user_payload: dict, user_data: dict, db: AsyncSession
    ):
        if not user_payload or not user_payload.get("id"):
            raise ApiError.BadRequest("Не удалось идентифицировать пользователя")

        user_id = user_payload["id"]
        prediction_id, request_id = user_data["prediction_id"], user_data["request_id"]

        # Проверяем, что пользователю действительно принадлежат прогноз и заявка
        await RequestService.check_patient_access(
            user_id, prediction_id, request_id, db
        )

        # Проверяем, что такого доступа еще нет
        existing_access = await db.scalar(
            select(AccessPrediction)
            .join(Prediction, Prediction.id == AccessPrediction.prediction_id)
            .join(Request, Request.id == AccessPrediction.request_id)
            .join(RequestStatus, RequestStatus.id == Request.status_id)
            .where(
                Prediction.id == prediction_id,
                AccessPrediction.access_status == "Активный",
                RequestStatus.name.in_(["Активный", "Завершено"]),
                or_(
                    RequestStatus.name == "Активный",
                    AccessPrediction.doctor_comment.is_not(None),
                ),
            )
        )
        if existing_access:
            raise ApiError.BadRequest(
                f"По прогнозу с id = {prediction_id} уже есть активный доступ или комментарий"
            )

        access_prediction = AccessPrediction(
            prediction_id=prediction_id, request_id=request_id, access_status="Активный"
        )

        async with transactional(db):
            db.add(access_prediction)

        return await RequestService.get_prediction_by_id(prediction_id, db)

    @staticmethod
    async def update_access_prediction(
        user_payload: dict, access_id: int, user_data: dict, db: AsyncSession
    ):
        if not user_payload or not user_payload.get("id"):
            raise ApiError.BadRequest("Не удалось идентифицировать пользователя")

        # Проверям, принадлежит ли доступ данному пользователю
        user_id = user_payload["id"]
        check_query = (
            select(AccessPrediction)
            .join(AccessPrediction.request)
            .join(Request.patient)
            .where(AccessPrediction.id == access_id, Patient.user_id == user_id)
        )
        result = await db.execute(check_query)
        access_prediction = result.scalar_one_or_none()
        if not access_prediction:
            raise ApiError.BadRequest(
                f"Доступ к прогнозу с id={access_id} не найден или у вас нет прав"
            )

        async with transactional(db):
            access_prediction.access_status = user_data["access_status"]

        return await RequestService.get_prediction_by_id(
            access_prediction.prediction_id, db
        )

    @staticmethod
    async def get_active_doctors(user_payload: dict, db: AsyncSession):
        return await RequestService.get_requests(user_payload, "Активный", db)

    @staticmethod
    async def get_active_patients(user_payload: dict, db: AsyncSession):
        return await RequestService.get_requests(user_payload, "Активный", db)

    @staticmethod
    async def get_access_predictions(
        user_payload: dict, patient_id: int, db: AsyncSession
    ):
        if not user_payload or not user_payload.get("id"):
            raise ApiError.BadRequest("Не удалось идентифицировать пользователя")

        user_id = user_payload["id"]

        query = (
            select(Prediction, AccessPrediction)
            .join(AccessPrediction, AccessPrediction.prediction_id == Prediction.id)
            .join(Request, Request.id == AccessPrediction.request_id)
            .join(RequestStatus, RequestStatus.id == Request.status_id)
            .join(Patient, Patient.id == Request.patient_id)
            .join(Doctor, Doctor.id == Request.doctor_id)
            .where(
                Doctor.user_id == user_id,
                Patient.id == patient_id,
                AccessPrediction.access_status == "Активный",
            )
            .options(
                selectinload(Prediction.prediction_results).selectinload(
                    PredictionResult.analyte
                ),
                selectinload(AccessPrediction.request)
                .selectinload(Request.doctor)
                .selectinload(Doctor.user),
                selectinload(AccessPrediction.request).selectinload(Request.status),
            )
        ).order_by(AccessPrediction.update_date.desc())

        result = await db.execute(query)
        rows = result.all()
        if not rows:
            raise ApiError.AccessDeniedError(
                f"Прогнозы пациента с id = {patient_id} не найдены либо у вас нет прав доступа к ним"
            )

        response_dtos = [
            PredictionDtoBuilder.build_from_access_prediction(pred, access).to_dict()
            for pred, access in rows
        ]
        return response_dtos

    @staticmethod
    async def get_access_prediction(
        user_payload: dict, patient_id: int, prediction_id: int, db: AsyncSession
    ):
        if not user_payload or not user_payload.get("id"):
            raise ApiError.BadRequest("Не удалось идентифицировать пользователя")

        user_id = user_payload["id"]

        # Проверяем, что у врача есть доступ к этому прогнозу
        query = (
            select(AccessPrediction)
            .join(AccessPrediction.prediction)
            .join(AccessPrediction.request)
            .join(Request.doctor)
            .where(
                AccessPrediction.prediction_id == prediction_id,
                AccessPrediction.access_status == "Активный",
                Doctor.user_id == user_id,
            )
            .options(
                selectinload(AccessPrediction.prediction)
                .selectinload(Prediction.prediction_results)
                .selectinload(PredictionResult.analyte),
                selectinload(AccessPrediction.request).selectinload(Request.status),
                selectinload(AccessPrediction.request)
                .selectinload(Request.doctor)
                .selectinload(Doctor.user),
            )
        )

        result = await db.execute(query)
        access_pred = result.scalar_one_or_none()
        if not access_pred:
            raise ApiError.AccessDeniedError(
                f"Прогноз с id = {prediction_id} не существует или у вас нет прав доступа к нему"
            )

        # Если доступ есть - возвращаем найденный прогноз
        response_dto = PredictionDtoBuilder.build_from_access_prediction(
            access_pred.prediction, access_pred
        )
        return response_dto.to_dict()

    @staticmethod
    async def comment_prediction(
        user_payload: dict,
        prediction_id: int,
        user_data: dict,
        db: AsyncSession,
    ):
        if not user_payload or not user_payload.get("id"):
            raise ApiError.BadRequest("Не удалось идентифицировать пользователя")

        user_id = user_payload["id"]

        # Проверяем, что у пользователя есть право на редактирование
        check_query = (
            select(AccessPrediction)
            .join(Request, Request.id == AccessPrediction.request_id)
            .join(RequestStatus, RequestStatus.id == Request.status_id)
            .join(Doctor, Doctor.id == Request.doctor_id)
            .where(
                AccessPrediction.prediction_id == prediction_id,
                AccessPrediction.access_status == "Активный",
                Doctor.user_id == user_id,
                RequestStatus.name == "Активный",
            )
        )

        result = await db.execute(check_query)
        access = result.scalar_one_or_none()
        if not access:
            raise ApiError.AccessDeniedError(
                f"Прогноз с id = {prediction_id} не найден либо у вас нет прав доступа к нему"
            )

        # Добавляем комментарий к прогнозу
        async with transactional(db):
            access.doctor_comment = user_data["doctor_comment"]
            access.comment_date = datetime.now()

        return await RequestService.get_prediction_by_id(access.prediction_id, db)

    @staticmethod
    async def delete_comment(
        user_payload: dict,
        prediction_id: int,
        db: AsyncSession,
    ):
        if not user_payload or not user_payload.get("id"):
            raise ApiError.BadRequest("Не удалось идентифицировать пользователя")

        user_id = user_payload["id"]

        # Проверяем, что у пользователя есть право на удаление
        check_query = (
            select(AccessPrediction)
            .join(Request, Request.id == AccessPrediction.request_id)
            .join(RequestStatus, RequestStatus.id == Request.status_id)
            .join(Doctor, Doctor.id == Request.doctor_id)
            .where(
                AccessPrediction.prediction_id == prediction_id,
                AccessPrediction.access_status == "Активный",
                Doctor.user_id == user_id,
                RequestStatus.name == "Активный",
            )
        )

        result = await db.execute(check_query)
        access = result.scalar_one_or_none()
        if not access:
            raise ApiError.AccessDeniedError(
                f"Прогноз с id = {prediction_id} не найден либо у вас нет прав доступа к нему"
            )

        # Добавляем комментарий к прогнозу
        async with transactional(db):
            access.doctor_comment = None
            access.comment_date = datetime.now()

        return await RequestService.get_prediction_by_id(access.prediction_id, db)

    @staticmethod
    async def get_sample(user_payload: dict, sample_id: int, db: AsyncSession):
        if not user_payload or not user_payload.get("id"):
            raise ApiError.BadRequest("Не удалось идентифицировать пользователя")

        user_id = user_payload["id"]

        check_query = (
            select(AccessPrediction)
            .join(Prediction, AccessPrediction.prediction_id == Prediction.id)
            .join(Sample, Sample.id == Prediction.sample_id)
            .join(Request, Request.id == AccessPrediction.request_id)
            .join(Doctor, Doctor.id == Request.doctor_id)
            .where(
                Sample.id == sample_id,
                Doctor.user_id == user_id,
                AccessPrediction.access_status == "Активный",
            )
        )
        check_access = await db.execute(check_query)
        check_access = check_access.scalars().all()
        if not check_access:
            raise ApiError.BadRequest(
                f"Анализ крови с id = {sample_id} не существует или у вас нет прав доступа"
            )

        query = (
            select(Sample)
            .where(Sample.id == sample_id)
            .options(
                selectinload(Sample.sample_results).selectinload(SampleResult.analyte)
            )
        )
        sample = await db.scalar(query)
        if not sample:
            raise ApiError.BadRequest(f"Анализ крови с id = {sample_id} не найден")

        result = SampleDtoBuilder.build_from_sample(sample)
        return result.to_dict()
