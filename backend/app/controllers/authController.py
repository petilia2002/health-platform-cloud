from fastapi import Request, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import ValidationError

from app.schemas.schemas import (
    UserLogin,
    PatientRegistration,
    DoctorRegistration,
    AdminRegistration,
    RoleEnum,
)
from app.utils.request_parser import RequestData
from app.services.authService import AuthService
from app.core.config import CLIENT_URL
from app.exceptions.apiError import ApiError


class AuthController:
    @staticmethod
    async def registration(req: RequestData, res: Response, db: AsyncSession):
        try:
            user_role = req.body.get("role")
            if not user_role:
                raise ApiError.BadRequest(message="Не указана роль пользователя")

            if user_role not in [role.value for role in RoleEnum]:
                raise ApiError.BadRequest(message=f"Неизвестная роль: {user_role}")

            user_data = (
                PatientRegistration(**req.body)
                if user_role == RoleEnum.patient
                else (
                    DoctorRegistration(**req.body)
                    if user_role == RoleEnum.doctor
                    else AdminRegistration(**req.body)
                )
            )

            user_response = await AuthService.registration(user_data, db)
            res.set_cookie(
                key="refresh_token",
                value=user_response.refresh_token,
                max_age=8 * 7 * 24 * 60 * 60,
                secure=False,
                httponly=True,
                samesite="lax",
            )
            return user_response
        except ValidationError as e:
            messages = [err["msg"] for err in e.errors()]
            raise ApiError.BadRequest(message=", ".join(messages), errors=e.errors())
        except Exception as e:
            raise

    @staticmethod
    async def login(req: RequestData, res: Response, db: AsyncSession):
        try:
            user_data = await AuthService.login(UserLogin(**req.body), db)
            res.set_cookie(
                key="refresh_token",
                value=user_data.refresh_token,
                max_age=8 * 7 * 24 * 60 * 60,
                secure=False,
                httponly=True,
                samesite="lax",
            )
            return user_data
        except ValidationError as e:
            messages = [err["msg"] for err in e.errors()]
            raise ApiError.BadRequest(message=", ".join(messages), errors=e.errors())
        except Exception as e:
            raise

    @staticmethod
    async def logout(refresh_token: str, res: Response, db: AsyncSession):
        try:
            res.delete_cookie(key="refresh_token")
            return await AuthService.logout(refresh_token, db)
        except Exception as e:
            raise

    @staticmethod
    async def activate(link: str, db: AsyncSession):
        try:
            await AuthService.activate(str(link), db)
            return RedirectResponse(url=CLIENT_URL, status_code=302)
        except Exception as e:
            raise

    @staticmethod
    async def confirm(user_payload: dict, db: AsyncSession):
        try:
            await AuthService.confirm(user_payload, db)
            return {"message": "Письмо с подтверждением отправлено на почту!"}
        except Exception as e:
            raise

    @staticmethod
    async def refresh(refresh_token: str, res: Response, db: AsyncSession):
        try:
            user_data = await AuthService.refresh(refresh_token, db)
            res.set_cookie(
                key="refresh_token",
                value=user_data.refresh_token,
                max_age=8 * 7 * 24 * 60 * 60,
                secure=False,
                httponly=True,
                samesite="lax",
            )
            return user_data
        except Exception as e:
            raise

    @staticmethod
    async def get_users(db: AsyncSession):
        try:
            return await AuthService.get_users(db)
        except Exception as e:
            raise

    @staticmethod
    async def get_user(user_id: int, db: AsyncSession):
        try:
            return await AuthService.get_user(user_id, db)
        except Exception as e:
            raise

    @staticmethod
    async def get_me(payload: dict, db: AsyncSession):
        try:
            return await AuthService.get_me(payload, db)
        except Exception as e:
            raise
