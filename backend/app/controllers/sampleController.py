from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import ValidationError
from typing import Optional
from datetime import date

from app.schemas.schemas import BloodTestCreate, BloodTestUpdate
from app.utils.request_parser import RequestData
from app.services.sampleService import SampleService
from app.exceptions.apiError import ApiError


class SampleController:
    @staticmethod
    async def get_samples(
        payload: dict,
        page: Optional[int],
        limit: Optional[int],
        start_date: Optional[date],
        end_date: Optional[date],
        db: AsyncSession,
    ):
        try:
            return await SampleService.get_samples(
                payload, page, limit, start_date, end_date, db
            )
        except Exception as e:
            raise

    @staticmethod
    async def get_sample(sample_id: int, db: AsyncSession):
        try:
            return await SampleService.get_sample_by_id(sample_id, db)
        except Exception as e:
            raise

    @staticmethod
    async def create_sample(req: RequestData, payload: dict, db: AsyncSession):
        try:
            sample_data = BloodTestCreate(**req.body)
            sample_response = await SampleService.create_sample(
                payload, sample_data, db
            )
            return sample_response
        except ValidationError as e:
            messages = [err["msg"] for err in e.errors()]
            raise ApiError.BadRequest(message=", ".join(messages), errors=e.errors())
        except Exception as e:
            raise

    @staticmethod
    async def update_sample(sample_id: int, req: RequestData, db: AsyncSession):
        try:
            sample_data = BloodTestCreate(**req.body).model_dump()
            sample_response = await SampleService.update_sample(
                sample_id, sample_data, db
            )
            return sample_response
        except ValidationError as e:
            messages = [err["msg"] for err in e.errors()]
            raise ApiError.BadRequest(message=", ".join(messages), errors=e.errors())
        except Exception as e:
            raise

    @staticmethod
    async def patch_sample(sample_id: int, req: RequestData, db: AsyncSession):
        try:
            sample_data = BloodTestUpdate(**req.body).model_dump(
                exclude_unset=True, exclude_none=False
            )
            print(sample_data)
            sample_response = await SampleService.patch_sample(
                sample_id, sample_data, db
            )
            return sample_response
        except ValidationError as e:
            messages = [err["msg"] for err in e.errors()]
            raise ApiError.BadRequest(message=", ".join(messages), errors=e.errors())
        except Exception as e:
            raise

    @staticmethod
    async def delete_sample(sample_id: int, db: AsyncSession):
        try:
            return await SampleService.delete_sample(sample_id, db)
        except Exception as e:
            raise
