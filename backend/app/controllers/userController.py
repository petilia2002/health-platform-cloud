from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.services.userService import UserService


class UserController:
    @staticmethod
    async def get_patients(db: AsyncSession):
        try:
            return await UserService.get_patients(db)
        except Exception:
            raise

    @staticmethod
    async def get_patient_by_id(patient_id: int, db: AsyncSession):
        try:
            return await UserService.get_patient_by_id(patient_id, db)
        except Exception:
            raise

    @staticmethod
    async def get_doctors(query: Optional[str], db: AsyncSession):
        try:
            return await UserService.get_doctors(query, db)
        except Exception:
            raise

    @staticmethod
    async def get_doctors_with_statuses(
        user_payload: dict, query: Optional[str], db: AsyncSession
    ):
        try:
            return await UserService.get_doctors_with_statuses(user_payload, query, db)
        except Exception:
            raise

    @staticmethod
    async def get_admins(db: AsyncSession):
        try:
            return await UserService.get_admins(db)
        except Exception:
            raise
