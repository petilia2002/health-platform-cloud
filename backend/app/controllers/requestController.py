from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import ValidationError
from typing import Optional

from app.utils.request_parser import RequestData
from app.services.requestService import RequestService
from app.exceptions.apiError import ApiError
from app.schemas.schemas import (
    RequestCreate,
    RequestUpdate,
    AccessPredictionRequest,
    AccessPredictionUpdate,
    AccessPredictionComment,
)


class RequestController:
    @staticmethod
    async def get_requests(user_payload: dict, status: Optional[str], db: AsyncSession):
        try:
            return await RequestService.get_requests(user_payload, status, db)
        except Exception:
            raise

    @staticmethod
    async def get_request(user_payload: dict, request_id: int, db: AsyncSession):
        try:
            return await RequestService.get_request(user_payload, request_id, db)
        except Exception:
            raise

    @staticmethod
    async def create_request(
        user_payload: dict, request_data: RequestData, db: AsyncSession
    ):
        try:
            user_data = RequestCreate(**request_data.body).model_dump()
            request_response = await RequestService.create_request(
                user_payload, user_data, db
            )
            return request_response
        except ValidationError as e:
            messages = [err["msg"] for err in e.errors()]
            raise ApiError.BadRequest(message=", ".join(messages), errors=e.errors())
        except Exception:
            raise

    @staticmethod
    async def update_request(
        user_payload: dict, request_id: int, request_data: RequestData, db: AsyncSession
    ):
        try:
            user_data = RequestUpdate(**request_data.body).model_dump()
            request_response = await RequestService.update_request(
                user_payload, request_id, user_data, db
            )
            return request_response
        except ValidationError as e:
            messages = [err["msg"] for err in e.errors()]
            raise ApiError.BadRequest(message=", ".join(messages), errors=e.errors())
        except Exception:
            raise

    @staticmethod
    async def create_access_prediction(
        user_payload: dict, request_data: RequestData, db: AsyncSession
    ):
        try:
            user_data = AccessPredictionRequest(**request_data.body).model_dump()
            acess_response = await RequestService.create_access_prediction(
                user_payload, user_data, db
            )
            return acess_response
        except ValidationError as e:
            messages = [err["msg"] for err in e.errors()]
            raise ApiError.BadRequest(message=", ".join(messages), errors=e.errors())
        except Exception:
            raise

    @staticmethod
    async def update_access_prediction(
        user_payload: dict, access_id: int, request_data: RequestData, db: AsyncSession
    ):
        try:
            user_data = AccessPredictionUpdate(**request_data.body).model_dump()
            acess_response = await RequestService.update_access_prediction(
                user_payload, access_id, user_data, db
            )
            return acess_response
        except Exception:
            raise

    @staticmethod
    async def get_active_doctors(user_payload: dict, db: AsyncSession):
        try:
            return await RequestService.get_active_doctors(user_payload, db)
        except Exception:
            raise

    @staticmethod
    async def get_active_patients(user_payload: dict, db: AsyncSession):
        try:
            return await RequestService.get_active_patients(user_payload, db)
        except Exception:
            raise

    @staticmethod
    async def get_access_predictions(
        user_payload: dict, patient_id: int, db: AsyncSession
    ):
        try:
            return await RequestService.get_access_predictions(
                user_payload, patient_id, db
            )
        except Exception:
            raise

    @staticmethod
    async def get_access_prediction(
        user_payload: dict, patient_id: int, prediction_id: int, db: AsyncSession
    ):
        try:
            return await RequestService.get_access_prediction(
                user_payload, patient_id, prediction_id, db
            )
        except Exception:
            raise

    @staticmethod
    async def comment_prediction(
        user_payload: dict,
        prediction_id: int,
        request_data: RequestData,
        db: AsyncSession,
    ):
        try:
            user_data = AccessPredictionComment(**request_data.body).model_dump()
            request_response = await RequestService.comment_prediction(
                user_payload, prediction_id, user_data, db
            )
            return request_response
        except ValidationError as e:
            messages = [err["msg"] for err in e.errors()]
            raise ApiError.BadRequest(message=", ".join(messages), errors=e.errors())
        except Exception:
            raise

    @staticmethod
    async def delete_comment(
        user_payload: dict,
        prediction_id: int,
        db: AsyncSession,
    ):
        try:
            return await RequestService.delete_comment(user_payload, prediction_id, db)
        except Exception:
            raise

    @staticmethod
    async def get_sample(user_payload: dict, sample_id: int, db: AsyncSession):
        try:
            return await RequestService.get_sample(user_payload, sample_id, db)
        except Exception:
            raise
