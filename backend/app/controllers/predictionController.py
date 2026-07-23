from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from datetime import date

from app.services.predictionService import PredictionService


class PredictionController:
    @staticmethod
    async def get_predictions(
        payload: dict,
        page: Optional[int],
        limit: Optional[int],
        start_date: Optional[date],
        end_date: Optional[date],
        db: AsyncSession,
    ):
        try:
            return await PredictionService.get_predictions(
                payload, page, limit, start_date, end_date, db
            )
        except Exception:
            raise

    @staticmethod
    async def get_prediction_by_id(
        user_payload: dict, prediction_id: int, db: AsyncSession
    ):
        try:
            return await PredictionService.get_prediction_by_id(
                user_payload, prediction_id, db
            )
        except Exception:
            raise

    @staticmethod
    async def create_prediction(payload: dict, sample_id: int, db: AsyncSession):
        try:
            prediction_response = await PredictionService.create_prediction(
                payload,
                sample_id,
                db,
            )
            return prediction_response
        except Exception:
            raise

    @staticmethod
    async def delete_prediction(prediction_id: int, db: AsyncSession):
        try:
            return await PredictionService.delete_prediction(prediction_id, db)
        except Exception:
            raise
