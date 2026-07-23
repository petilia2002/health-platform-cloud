from fastapi import APIRouter, Depends, Request, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.db.database import get_async_db
from app.controllers.requestController import RequestController
from app.utils.request_parser import parse_request
from app.dependencies.roleDependency import require_roles

router = APIRouter(tags=["requests"], responses={404: {"description": "Not Found"}})


@router.get(path="/requests")
async def get_requests(
    request: Request,
    _: dict = Depends(require_roles(["Пациент", "Врач", "Администратор"])),
    status: Optional[str] = Query(None, description="Статус заявки"),
    db: AsyncSession = Depends(get_async_db),
):
    user_payload = request.state.user_payload
    return await RequestController.get_requests(user_payload, status, db)


@router.get(path="/requests/{request_id}")
async def get_request(
    request: Request,
    request_id: int,
    _: dict = Depends(require_roles(["Пациент", "Врач", "Администратор"])),
    db: AsyncSession = Depends(get_async_db),
):
    user_payload = request.state.user_payload
    return await RequestController.get_request(user_payload, request_id, db)


@router.post(path="/requests")
async def create_request(
    request: Request,
    _: dict = Depends(require_roles(["Пациент"])),
    db: AsyncSession = Depends(get_async_db),
):
    user_payload = request.state.user_payload
    request_data = await parse_request(request)
    return await RequestController.create_request(user_payload, request_data, db)


@router.put(path="/requests/{request_id}")
async def update_request(
    request: Request,
    request_id: int,
    _: dict = Depends(require_roles(["Пациент", "Врач", "Администратор"])),
    db: AsyncSession = Depends(get_async_db),
):
    user_payload = request.state.user_payload
    request_data = await parse_request(request)
    return await RequestController.update_request(
        user_payload, request_id, request_data, db
    )


@router.post(path="/requests/access")
async def create_access_prediction(
    request: Request,
    _: dict = Depends(require_roles(["Пациент"])),
    db: AsyncSession = Depends(get_async_db),
):
    user_payload = request.state.user_payload
    request_data = await parse_request(request)
    return await RequestController.create_access_prediction(
        user_payload, request_data, db
    )


@router.patch(path="/requests/access/{access_id}")
async def update_access_prediction(
    request: Request,
    access_id: int,
    _: dict = Depends(require_roles(["Пациент"])),
    db: AsyncSession = Depends(get_async_db),
):
    user_payload = request.state.user_payload
    request_data = await parse_request(request)
    return await RequestController.update_access_prediction(
        user_payload, access_id, request_data, db
    )


@router.get(path="/doctors/me")
async def get_active_doctors(
    request: Request,
    _: dict = Depends(require_roles(["Пациент"])),
    db: AsyncSession = Depends(get_async_db),
):
    user_payload = request.state.user_payload
    return await RequestController.get_active_doctors(user_payload, db)


@router.get(path="/patients/me")
async def get_active_patients(
    request: Request,
    _: dict = Depends(require_roles(["Врач"])),
    db: AsyncSession = Depends(get_async_db),
):
    user_payload = request.state.user_payload
    return await RequestController.get_active_patients(user_payload, db)


@router.get(path="/patients/{patient_id}/predictions")
async def get_access_predictions(
    request: Request,
    patient_id: int,
    _: dict = Depends(require_roles(["Врач"])),
    db: AsyncSession = Depends(get_async_db),
):
    user_payload = request.state.user_payload
    return await RequestController.get_access_predictions(user_payload, patient_id, db)


@router.get(path="/patients/{patient_id}/predictions/{prediction_id}")
async def get_access_prediction(
    request: Request,
    patient_id: int,
    prediction_id: int,
    _: dict = Depends(require_roles(["Врач"])),
    db: AsyncSession = Depends(get_async_db),
):
    user_payload = request.state.user_payload
    return await RequestController.get_access_prediction(
        user_payload, patient_id, prediction_id, db
    )


@router.patch(path="/patients/{patient_id}/predictions/{prediction_id}")
async def comment_prediction(
    request: Request,
    prediction_id: int,
    _: dict = Depends(require_roles(["Пациент", "Врач", "Администратор"])),
    db: AsyncSession = Depends(get_async_db),
):
    user_payload = request.state.user_payload
    request_data = await parse_request(request)
    return await RequestController.comment_prediction(
        user_payload, prediction_id, request_data, db
    )


@router.delete(path="/patients/{patient_id}/predictions/{prediction_id}")
async def delete_comment(
    request: Request,
    prediction_id: int,
    _: dict = Depends(require_roles(["Пациент", "Врач", "Администратор"])),
    db: AsyncSession = Depends(get_async_db),
):
    user_payload = request.state.user_payload
    return await RequestController.delete_comment(user_payload, prediction_id, db)


@router.get(path="/patients/samples/{sample_id}")
async def get_sample(
    request: Request,
    sample_id: int,
    _: dict = Depends(require_roles(["Врач"])),
    db: AsyncSession = Depends(get_async_db),
):
    user_payload = request.state.user_payload
    return await RequestController.get_sample(user_payload, sample_id, db)
