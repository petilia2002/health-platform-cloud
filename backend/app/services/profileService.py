from fastapi import UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
import os
from pathlib import Path

from app.core.config import API_URL, UPLOAD_FOLDER
from app.db.transaction import transactional
from app.core.security import async_hash_password, async_verify_password

# from app.yolo.detector import YOLOFaceDetector
from app.yolo.detector import PhotoCropper
from app.services.fileService import FileService
from app.exceptions.apiError import ApiError
from app.schemas.schemas import UserProfileData, PatientProfileData, DoctorProfileData
from app.models.models import User, Patient, Doctor, Gender
from app.dtos.patientDto import PatientDto
from app.dtos.doctorDto import DoctorDto
from app.dtos.adminDto import AdminDto


class ProfileService:
    @staticmethod
    async def get_my_profile(user_payload: dict, db: AsyncSession):
        if not user_payload or not user_payload.get("id"):
            raise ApiError.BadRequest(f"Не удалось идентифицировать пользователя")

        user_id = user_payload["id"]
        response = await db.execute(
            select(User)
            .options(selectinload(User.gender), selectinload(User.role))
            .where(User.id == user_id)
        )
        user = response.scalar_one_or_none()
        if not user:
            raise ApiError.BadRequest(f"Пользователь с id = {user_id} не существует")

        profile = None
        if user_payload["role"] == "Врач":
            response = await db.execute(select(Doctor).where(Doctor.user_id == user_id))
            doctor = response.scalars().first()
            profile = DoctorDto(user, doctor)
        elif user_payload["role"] == "Пациент":
            response = await db.execute(
                select(Patient).where(Patient.user_id == user_id)
            )
            patient = response.scalars().first()
            profile = PatientDto(user, patient)
        else:
            profile = AdminDto(user)
        return profile

    @staticmethod
    def verify_access_rights(auth_role: str, user_role: str) -> bool:
        if auth_role == "Администратор":
            return True

        if auth_role == "Пациент":
            return user_role == "Врач" or user_role == "Пациент"

        if auth_role == "Врач":
            return user_role != "Администратор"

        return False

    @staticmethod
    async def get_user_profile(user_payload: dict, user_id: int, db: AsyncSession):
        if (
            not user_payload
            or not user_payload.get("id")
            or not user_payload.get("role")
        ):
            raise ApiError.BadRequest(
                f"Не удалось идентифицировать пользователя, запрашивающего данные"
            )

        auth_id, auth_role = user_payload["id"], user_payload["role"]
        response = await db.execute(
            select(User)
            .options(selectinload(User.gender), selectinload(User.role))
            .where(User.id == user_id)
        )
        user = response.scalar_one_or_none()
        if not user:
            raise ApiError.BadRequest(f"Запрашиваемый профиль не найден в системе")
        user_role = user.role.name

        if auth_id != user_id and not ProfileService.verify_access_rights(
            auth_role, user_role
        ):
            raise ApiError.AccessDeniedError(
                f"У вас нет прав доступа к профилю данного пользователя"
            )

        profile = None
        if user_role == "Врач":
            response = await db.execute(select(Doctor).where(Doctor.user_id == user_id))
            doctor = response.scalars().first()
            profile = DoctorDto(user, doctor)
        elif user_role == "Пациент":
            response = await db.execute(
                select(Patient).where(Patient.user_id == user_id)
            )
            patient = response.scalars().first()
            profile = PatientDto(user, patient)
        else:
            profile = AdminDto(user)
        return profile

    @staticmethod
    async def update_profile(
        user_payload: dict,
        input_data: dict,
        files: dict,
        db: AsyncSession,
    ):
        if (
            not user_payload
            or not user_payload.get("id")
            or not user_payload.get("role")
        ):
            raise ApiError.BadRequest(f"Не удалось идентифицировать пользователя")

        user_id, role = user_payload["id"], user_payload["role"]

        user_data = UserProfileData(**input_data).model_dump(
            exclude_unset=False, exclude_none=False
        )

        response = await db.execute(
            select(User)
            .where(User.id == user_id)
            .options(selectinload(User.gender), selectinload(User.role))
        )
        user = response.scalars().first()

        # Обновляем пол, если пришел
        if "gender" in user_data:
            gender_name = user_data.pop("gender")
            if gender_name:
                gender_query = await db.execute(
                    select(Gender).where(Gender.name == gender_name)
                )
                db_gender = gender_query.scalars().first()
                if not db_gender:
                    raise ApiError.BadRequest(f"Пол '{gender_name}' не найден")
                user.gender = db_gender

        # Обновляем остальные атрибуты
        for key, value in user_data.items():
            if hasattr(user, key):
                setattr(user, key, value)

        # Обновляем фото при его наличии в запросе
        photo = files.get("photo")
        if photo:
            await ProfileService.update_photo(user_payload, photo, db)
        else:
            await ProfileService.delete_photo(user_payload, db)

        # Обновляем пароль если пришел запрос на его смену
        cur_password, new_password = user_data.get("cur_password"), user_data.get(
            "new_password"
        )
        if cur_password and new_password:
            password_is_valid = await async_verify_password(cur_password, user.password)
            if not password_is_valid:
                raise ApiError.BadRequest(message="Введен неверный пароль")

            hash_pass = await async_hash_password(new_password)
            user.password = hash_pass

        profile = None
        if role == "Пациент":
            profile_data = PatientProfileData(**input_data).model_dump(
                exclude_unset=False, exclude_none=False
            )
            response = await db.execute(
                select(Patient).where(Patient.user_id == user_id)
            )
            patient = response.scalars().first()
            for key, value in profile_data.items():
                if hasattr(patient, key):
                    setattr(patient, key, value)
            profile = PatientDto(user, patient)
        elif role == "Врач":
            profile_data = DoctorProfileData(**input_data).model_dump(
                exclude_unset=False, exclude_none=False
            )
            response = await db.execute(select(Doctor).where(Doctor.user_id == user_id))
            doctor = response.scalars().first()
            for key, value in profile_data.items():
                if hasattr(doctor, key):
                    setattr(doctor, key, value)
            profile = DoctorDto(user, doctor)
        else:
            profile = AdminDto(user)

        await db.commit()
        await db.refresh(user)

        return profile

    @staticmethod
    async def get_avatar_file(user_payload: dict, db: AsyncSession):
        if not user_payload or not user_payload.get("id"):
            raise ApiError.BadRequest(f"Не удалось идентифицировать пользователя")

        user_id = user_payload["id"]
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if not user:
            raise ApiError.BadRequest(f"Пользователь не найден")

        filename = user.photo
        file_path = UPLOAD_FOLDER / "photos" / filename
        headers = {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
        }

        return FileResponse(file_path, headers=headers)

    @staticmethod
    async def get_photo(user_payload: dict, db: AsyncSession):
        if not user_payload or not user_payload.get("id"):
            raise ApiError.BadRequest(f"Не удалось идентифицировать пользователя")

        user_id = user_payload["id"]
        result = await db.execute(
            select(User.photo, User.icon).where(User.id == user_id)
        )
        row = result.first()
        if not row:
            raise ApiError.BadRequest(f"Пользователь не найден")

        photo, icon = row

        return {
            "photo_url": (f"{API_URL}/api/upload/photos/{photo}" if photo else None),
            "photo_name": photo,
            "icon_url": (f"{API_URL}/api/upload/icons/{icon}" if icon else None),
            "icon_name": icon,
        }

    @staticmethod
    async def upload_photo(user_payload: dict, photo: UploadFile, db: AsyncSession):
        if not user_payload or not user_payload.get("id"):
            raise ApiError.BadRequest(f"Не удалось идентифицировать пользователя")

        user_id = user_payload["id"]
        filename = await FileService.save_uploaded_file("photos", photo)

        # photo_path = os.path.join(UPLOAD_FOLDER, "photos", filename)
        # detector = YOLOFaceDetector()
        # icon_name = detector.create_icon(photo_path, "icons")
        photo_path = UPLOAD_FOLDER / "photos" / filename
        detector = PhotoCropper()
        icon_name = detector.create_icon(str(photo_path), "icons")

        await db.execute(
            update(User)
            .where(User.id == user_id)
            .values(photo=filename, icon=icon_name)
        )
        await db.commit()

        return {
            "photo_url": (
                f"{API_URL}/api/upload/photos/{filename}" if filename else None
            ),
            "photo_name": filename,
            "icon_url": (
                f"{API_URL}/api/upload/icons/{icon_name}" if icon_name else None
            ),
            "icon_name": icon_name,
        }

    @staticmethod
    async def update_photo(user_payload: dict, photo: UploadFile, db: AsyncSession):
        if not user_payload or not user_payload.get("id"):
            raise ApiError.BadRequest(f"Не удалось идентифицировать пользователя")

        user_id = user_payload["id"]
        user = await db.scalar(select(User).where(User.id == user_id))
        if user.photo:
            await FileService.delete_file("photos", user.photo)
        if user.icon:
            await FileService.delete_file("icons", user.icon)

        filename = await FileService.save_uploaded_file("photos", photo)

        # photo_path = os.path.join(UPLOAD_FOLDER, "photos", filename)
        # detector = YOLOFaceDetector()
        # icon_name = detector.create_icon(photo_path, "icons")
        photo_path = UPLOAD_FOLDER / "photos" / filename
        detector = PhotoCropper()
        icon_name = detector.create_icon(str(photo_path), "icons")

        await db.execute(
            update(User)
            .where(User.id == user_id)
            .values(photo=filename, icon=icon_name)
        )
        await db.commit()

        return {
            "photo_url": (
                f"{API_URL}/api/upload/photos/{filename}" if filename else None
            ),
            "photo_name": filename,
            "icon_url": (
                f"{API_URL}/api/upload/icons/{icon_name}" if icon_name else None
            ),
            "icon_name": icon_name,
        }

    @staticmethod
    async def delete_photo(user_payload: dict, db: AsyncSession):
        if not user_payload or not user_payload.get("id"):
            raise ApiError.BadRequest(f"Не удалось идентифицировать пользователя")

        user_id = user_payload["id"]
        user = await db.scalar(select(User).where(User.id == user_id))

        if user.photo:
            await FileService.delete_file("photos", user.photo)
        if user.icon:
            await FileService.delete_file("icons", user.icon)

        async with transactional(db):
            user.photo = None
            user.icon = None

        return {"message": "Фото успешно удалено"}
