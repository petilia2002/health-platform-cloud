from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload
from typing import Optional
from datetime import datetime, date, time

from app.schemas.schemas import BloodTestCreate
from app.dtos.sampleDto import SampleDtoBuilder
from app.exceptions.apiError import ApiError
from app.db.transaction import transactional
from app.models.models import Patient, Sample, SampleResult, Analyte

REQUIRED_FIELDS = {
    "hgb": "Гемоглобин",
    "rbc": "Эритроциты",
    "wbc": "Лейкоциты",
    "plt": "Тромбоциты",
    "mcv": "Средний корпускулярный объём",
    "neut": "Нейтрофилы",
    "baso": "Базофилы",
    "mono": "Моноциты",
    "eo": "Эозинофилы",
    "lymph": "Лимфоциты",
}


class SampleService:
    @staticmethod
    async def get_samples(
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

        samples_query = (
            select(Sample)
            .options(
                selectinload(Sample.sample_results).selectinload(SampleResult.analyte)
            )
            .where(Sample.patient_id == patient.id)
            .order_by(Sample.upload_date.desc())
        )

        if start_date:
            samples_query = samples_query.where(
                Sample.upload_date >= datetime.combine(start_date, time.min)
            )
        if end_date:
            samples_query = samples_query.where(
                Sample.upload_date <= datetime.combine(end_date, time.max)
            )

        if page is not None and limit is not None:
            samples_query = samples_query.offset(limit * (page - 1)).limit(limit)

        samples_response = await db.execute(samples_query)
        samples = samples_response.scalars().all()

        response_dtos = [
            SampleDtoBuilder.build_from_sample(sample).to_dict() for sample in samples
        ]
        return response_dtos

    @staticmethod
    async def get_sample_by_id(sample_id: int, db: AsyncSession):
        response = await db.execute(
            select(Sample)
            .options(
                selectinload(Sample.sample_results).selectinload(SampleResult.analyte)
            )
            .where(Sample.id == sample_id)
        )
        sample = response.scalar_one_or_none()
        if not sample:
            raise ApiError.BadRequest(f"Образец крови с id = {sample_id} не существует")

        response_dto = SampleDtoBuilder.build_from_sample(sample)
        return response_dto.to_dict()

    @staticmethod
    async def create_sample(payload: dict, sample: BloodTestCreate, db: AsyncSession):
        if not payload or not payload.get("id"):
            raise ApiError.BadRequest(
                f"Не удалось идентифицировать текущего пользователя"
            )

        user_id = payload["id"]
        sample_data = sample.model_dump(exclude_unset=True)

        patient = await db.scalar(select(Patient).where(Patient.user_id == user_id))
        if not patient:
            raise ApiError.BadRequest(f"Пациент не найден")

        analyte_names = list(sample_data.keys())
        analytes_response = await db.execute(
            select(Analyte).where(Analyte.view_name.in_(analyte_names))
        )
        analytes = {
            analyte.view_name: analyte for analyte in analytes_response.scalars()
        }

        new_sample = Sample(patient_id=patient.id)
        async with transactional(db):
            db.add(new_sample)
        await db.refresh(new_sample)

        results = []
        for name, value in sample_data.items():
            if value is not None and name in analytes:
                analyte = analytes[name]
                result = SampleResult(
                    value=value, analyte_id=analyte.id, sample_id=new_sample.id
                )
                results.append(result)

        async with transactional(db):
            db.add_all(results)
        await db.refresh(new_sample)

        return await SampleService.get_sample_by_id(new_sample.id, db)

    @staticmethod
    async def update_sample(
        sample_id: int,
        sample_data: dict,
        db: AsyncSession,
    ):
        sample = await db.scalar(
            select(Sample)
            .options(
                selectinload(Sample.sample_results).selectinload(SampleResult.analyte)
            )
            .where(Sample.id == sample_id)
        )
        if not sample:
            raise ApiError.BadRequest(f"Образец крови с id = {sample_id} не существует")

        analyte_names = list(sample_data.keys())
        analytes_response = await db.execute(
            select(Analyte).where(Analyte.view_name.in_(analyte_names))
        )
        analytes = {
            analyte.view_name: analyte for analyte in analytes_response.scalars()
        }
        existing_results = {r.analyte.view_name: r for r in sample.sample_results}

        async with transactional(db):
            sample.update_date = datetime.now()

            to_update = []
            to_create = []
            to_delete = []

            for name, value in sample_data.items():
                analyte = analytes.get(name)
                existing_result = existing_results.get(name)
                if value is not None:
                    if existing_result:
                        existing_result.value = value
                        to_update.append(existing_result)
                    else:
                        new_result = SampleResult(
                            value=value, analyte_id=analyte.id, sample_id=sample_id
                        )
                        to_create.append(new_result)
                else:
                    if existing_result:
                        to_delete.append(existing_result.id)

            if to_update:
                await db.flush()

            if to_create:
                db.add_all(to_create)

            if to_delete:
                await db.execute(
                    delete(SampleResult).where(SampleResult.id.in_(to_delete))
                )

        updated_response = await db.execute(
            select(SampleResult)
            .options(selectinload(SampleResult.analyte))
            .where(SampleResult.sample_id == sample_id)
        )
        updated_results = updated_response.scalars().all()

        blood_test = {
            "id": sample_id,
            "upload_date": sample.upload_date,
            "update_date": sample.update_date,
            "results": sorted(
                [
                    {
                        "analyte_name": r.analyte.name,
                        "analyte_view_name": r.analyte.view_name,
                        "value": r.value,
                        "units": r.analyte.units,
                        "analyte_id": r.analyte_id,
                    }
                    for r in updated_results
                ],
                key=lambda res: res["analyte_id"],
            ),
        }

        return blood_test

    @staticmethod
    async def patch_sample(
        sample_id: int,
        sample_data: dict,
        db: AsyncSession,
    ):
        for key, value in REQUIRED_FIELDS.items():
            if key in sample_data and not sample_data[key]:
                raise ApiError.BadRequest(f'Поле "{value}" не может быть пустым')

        return await SampleService.update_sample(sample_id, sample_data, db)

    @staticmethod
    async def delete_sample(sample_id: int, db: AsyncSession):
        response = await db.execute(
            select(Sample)
            .options(
                selectinload(Sample.sample_results).selectinload(SampleResult.analyte)
            )
            .where(Sample.id == sample_id)
        )
        sample = response.scalar_one_or_none()
        if not sample:
            raise ApiError.BadRequest(f"Образец крови с id = {sample_id} не существует")

        response_dto = SampleDtoBuilder.build_from_sample(sample)

        async with transactional(db):
            await db.delete(sample)

        return response_dto.to_dict()
