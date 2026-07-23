import aiofiles.os
from fastapi import UploadFile
import uuid
import aiofiles
import os
from pathlib import Path

from app.core.config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS
from app.exceptions.apiError import ApiError


class FileService:
    @staticmethod
    def _generate_unique_filename(filename: str):
        ext = filename.split(".")[-1]
        return f"{uuid.uuid4().hex}.{ext}"

    @staticmethod
    async def save_uploaded_file(folder: str, file: UploadFile | None):
        if not file:
            return None

        if not FileService.allowed_file(file.filename):
            return None

        try:
            unique_name = FileService._generate_unique_filename(file.filename)
            # path = os.path.join(UPLOAD_FOLDER, folder, unique_name)
            file_path = UPLOAD_FOLDER / folder / unique_name
            file_path.parent.mkdir(parents=True, exist_ok=True)

            async with aiofiles.open(file_path, "wb") as out_file:
                content = await file.read()
                await out_file.write(content)
            return unique_name
        except Exception:
            raise ApiError.FileSystemError("Ошибка при сохранении файла")

    @staticmethod
    async def delete_file(folder: str, filename: str):
        try:
            # path = os.path.join(UPLOAD_FOLDER, folder, filename)
            file_path = UPLOAD_FOLDER / folder / filename
            if file_path.exists():
                await aiofiles.os.remove(str(file_path))
        except Exception:
            raise ApiError.FileSystemError("Ошибка при удалении файла")

    @staticmethod
    def allowed_file(filename: str):
        return (
            "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
        )
