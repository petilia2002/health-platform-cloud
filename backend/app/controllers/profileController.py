from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import ValidationError

from app.utils.request_parser import RequestData
from app.services.profileService import ProfileService
from app.exceptions.apiError import ApiError


class ProfileController:
    @staticmethod
    async def get_my_profile(user_payload: dict, db: AsyncSession):
        try:
            return await ProfileService.get_my_profile(user_payload, db)
        except Exception:
            raise

    @staticmethod
    async def get_user_profile(user_payload: dict, user_id: int, db: AsyncSession):
        try:
            return await ProfileService.get_user_profile(user_payload, user_id, db)
        except Exception:
            raise

    @staticmethod
    async def update_profile(user_payload: dict, req: RequestData, db: AsyncSession):
        try:
            profile_response = await ProfileService.update_profile(
                user_payload, req.body, req.files, db
            )
            return profile_response
        except ValidationError as e:
            messages = [err["msg"] for err in e.errors()]
            raise ApiError.BadRequest(message=", ".join(messages), errors=e.errors())
        except Exception:
            raise

    @staticmethod
    async def get_avatar_file(user_payload: dict, db: AsyncSession):
        try:
            return await ProfileService.get_avatar_file(user_payload, db)
        except Exception:
            raise

    @staticmethod
    async def get_photo(user_payload: dict, db: AsyncSession):
        try:
            return await ProfileService.get_photo(user_payload, db)
        except Exception:
            raise

    @staticmethod
    async def upload_photo(user_payload: dict, photo: UploadFile, db: AsyncSession):
        try:
            return await ProfileService.upload_photo(user_payload, photo, db)
        except Exception:
            raise

    @staticmethod
    async def update_photo(user_payload: dict, photo: UploadFile, db: AsyncSession):
        try:
            return await ProfileService.update_photo(user_payload, photo, db)
        except Exception:
            raise

    @staticmethod
    async def delete_photo(user_payload: dict, db: AsyncSession):
        try:
            return await ProfileService.delete_photo(user_payload, db)
        except Exception:
            raise
