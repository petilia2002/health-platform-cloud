from fastapi import APIRouter, Depends, Request, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from datetime import date

from app.db.database import get_async_db
from app.controllers.sampleController import SampleController
from app.utils.request_parser import RequestData, parse_request
from app.dependencies.roleDependency import require_roles

router = APIRouter(
    prefix="/samples",
    tags=["samples"],
    responses={404: {"description": "Not Found"}},
    dependencies=[Depends(require_roles(["Пациент"]))],
)


@router.get(path="")
async def get_samples(
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
    return await SampleController.get_samples(
        payload, page, limit, start_date, end_date, db
    )


@router.get(path="/{sample_id}")
async def get_sample(
    sample_id: int,
    db: AsyncSession = Depends(get_async_db),
):
    return await SampleController.get_sample(sample_id, db)


@router.post(path="")
async def create_sample(
    request: Request,
    req: RequestData = Depends(parse_request),
    db: AsyncSession = Depends(get_async_db),
):
    payload = request.state.user_payload
    return await SampleController.create_sample(req, payload, db)


@router.put(path="/{sample_id}")
async def update_sample(
    sample_id: int,
    req: RequestData = Depends(parse_request),
    db: AsyncSession = Depends(get_async_db),
):
    return await SampleController.update_sample(sample_id, req, db)


@router.patch(path="/{sample_id}")
async def patch_sample(
    sample_id: int,
    req: RequestData = Depends(parse_request),
    db: AsyncSession = Depends(get_async_db),
):
    return await SampleController.patch_sample(sample_id, req, db)


@router.delete(path="/{sample_id}")
async def delete_sample(
    sample_id: int,
    db: AsyncSession = Depends(get_async_db),
):
    return await SampleController.delete_sample(sample_id, db)
