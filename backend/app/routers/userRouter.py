from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.db.database import get_async_db
from app.controllers.userController import UserController
from app.dependencies.roleDependency import require_roles

router = APIRouter(tags=["users"], responses={404: {"description": "Not Found"}})


@router.get(path="/patients")
async def get_patients(
    _: dict = Depends(require_roles(["Администратор"])),
    db: AsyncSession = Depends(get_async_db),
):
    return await UserController.get_patients(db)


@router.get(path="/patients/{patient_id}")
async def get_patient_by_id(
    patient_id: int,
    _: dict = Depends(require_roles(["Врач", "Администратор"])),
    db: AsyncSession = Depends(get_async_db),
):
    return await UserController.get_patient_by_id(patient_id, db)


@router.get(path="/admin/doctors")
async def get_doctors(
    request: Request,
    _: dict = Depends(require_roles(["Администратор"])),
    query: Optional[str] = Query(None, description="ФИО / Специализация / Адрес"),
    db: AsyncSession = Depends(get_async_db),
):
    return await UserController.get_doctors(query, db)


@router.get(path="/doctors")
async def get_doctors_with_statuses(
    request: Request,
    _: dict = Depends(require_roles(["Пациент"])),
    query: Optional[str] = Query(None, description="ФИО / Специализация / Адрес"),
    db: AsyncSession = Depends(get_async_db),
):
    user_payload = request.state.user_payload
    return await UserController.get_doctors_with_statuses(user_payload, query, db)


@router.get(path="/admins")
async def get_admins(
    _: dict = Depends(require_roles(["Администратор"])),
    db: AsyncSession = Depends(get_async_db),
):
    return await UserController.get_admins(db)
