from fastapi import APIRouter, Depends, Request, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from datetime import date

from app.db.database import get_async_db
from app.controllers.predictionController import PredictionController
from app.dependencies.roleDependency import require_roles

router = APIRouter(
    prefix="/predictions",
    tags=["predictions"],
    responses={404: {"description": "Not Found"}},
    dependencies=[Depends(require_roles(["Пациент"]))],
)


@router.get(path="")
async def get_predictions(
    request: Request,
    page: Optional[int] = Query(None, ge=1, description="Номер страницы"),
    limit: Optional[int] = Query(
        None, ge=1, le=100, description="Кол-во записей на странице"
    ),
    start_date: Optional[date] = Query(None, description="Начало периода"),
    end_date: Optional[date] = Query(None, description="Конец периода"),
    db: AsyncSession = Depends(get_async_db),
):
    payload = request.state.user_payload
    return await PredictionController.get_predictions(
        payload, page, limit, start_date, end_date, db
    )


@router.get(path="/{prediction_id}")
async def get_prediction_by_id(
    request: Request,
    prediction_id: int,
    db: AsyncSession = Depends(get_async_db),
):
    user_payload = request.state.user_payload
    return await PredictionController.get_prediction_by_id(
        user_payload, prediction_id, db
    )


@router.post(path="/{sample_id}")
async def create_prediction(
    request: Request,
    sample_id: int,
    db: AsyncSession = Depends(get_async_db),
):
    payload = request.state.user_payload
    return await PredictionController.create_prediction(payload, sample_id, db)


@router.delete(path="/{prediction_id}")
async def delete_prediction(
    prediction_id: int,
    db: AsyncSession = Depends(get_async_db),
):
    return await PredictionController.delete_prediction(prediction_id, db)
