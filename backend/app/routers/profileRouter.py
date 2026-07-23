from fastapi import APIRouter, Depends, Request, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_async_db
from app.controllers.profileController import ProfileController
from app.utils.request_parser import RequestData, parse_request
from app.dependencies.roleDependency import require_roles

router = APIRouter(
    prefix="/profile",
    tags=["profile"],
    responses={404: {"description": "Not Found"}},
    dependencies=[Depends(require_roles(["Пациент", "Врач", "Администратор"]))],
)


@router.get(path="/me")
async def get_my_profile(request: Request, db: AsyncSession = Depends(get_async_db)):
    user_payload = request.state.user_payload
    return await ProfileController.get_my_profile(user_payload, db)


@router.get(path="/{user_id}")
async def get_user_profile(
    request: Request, user_id: int, db: AsyncSession = Depends(get_async_db)
):
    user_payload = request.state.user_payload
    return await ProfileController.get_user_profile(user_payload, user_id, db)


@router.patch(path="")
async def update_profile(
    request: Request,
    req: RequestData = Depends(parse_request),
    db: AsyncSession = Depends(get_async_db),
):
    user_payload = request.state.user_payload
    return await ProfileController.update_profile(user_payload, req, db)


@router.get(path="/edit/photo")
async def get_avatar_file(request: Request, db: AsyncSession = Depends(get_async_db)):
    user_payload = request.state.user_payload
    return await ProfileController.get_avatar_file(user_payload, db)


@router.get(path="/photo")
async def get_photo(request: Request, db: AsyncSession = Depends(get_async_db)):
    user_payload = request.state.user_payload
    return await ProfileController.get_photo(user_payload, db)


@router.post(path="/photo")
async def upload_photo(
    request: Request, photo: UploadFile, db: AsyncSession = Depends(get_async_db)
):
    user_payload = request.state.user_payload
    return await ProfileController.upload_photo(user_payload, photo, db)


@router.put(path="/photo")
async def update_photo(
    request: Request, photo: UploadFile, db: AsyncSession = Depends(get_async_db)
):
    user_payload = request.state.user_payload
    return await ProfileController.update_photo(user_payload, photo, db)


@router.delete(path="/photo")
async def delete_photo(request: Request, db: AsyncSession = Depends(get_async_db)):
    user_payload = request.state.user_payload
    return await ProfileController.delete_photo(user_payload, db)
