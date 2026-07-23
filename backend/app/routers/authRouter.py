from fastapi import APIRouter, Depends, Request, Response, Cookie
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.db.database import get_async_db
from app.schemas.schemas import (
    UserResponse,
    LoginData,
    MessageResponse,
    UserBaseResponse,
    UserMe,
)
from app.controllers.authController import AuthController
from app.utils.request_parser import RequestData, parse_request
from app.dependencies.authDependency import require_auth
from app.dependencies.roleDependency import require_roles

router = APIRouter(tags=["auth"], responses={404: {"description": "Not Found"}})


@router.post(path="/registration", response_model=LoginData)
async def registration(
    res: Response,
    req: RequestData = Depends(parse_request),
    db: AsyncSession = Depends(get_async_db),
):
    return await AuthController.registration(req, res, db)


@router.post(path="/login", response_model=LoginData)
async def login(
    res: Response,
    req: RequestData = Depends(parse_request),
    db: AsyncSession = Depends(get_async_db),
):
    return await AuthController.login(req, res, db)


@router.post(path="/logout", response_model=MessageResponse)
async def logout(
    res: Response,
    refresh_token: str = Cookie(default=None),
    db: AsyncSession = Depends(get_async_db),
):
    return await AuthController.logout(refresh_token, res, db)


@router.get(path="/activate/{link}")
async def activate(link: str, db: AsyncSession = Depends(get_async_db)):
    return await AuthController.activate(link, db)


@router.get(path="/confirm")
async def confirm(
    request: Request,
    _: dict = Depends(require_auth),
    db: AsyncSession = Depends(get_async_db),
):
    user_payload = request.state.user_payload
    return await AuthController.confirm(user_payload, db)


@router.get(path="/refresh", response_model=LoginData)
async def refresh(
    res: Response,
    refresh_token: str = Cookie(default=None),
    db: AsyncSession = Depends(get_async_db),
):
    return await AuthController.refresh(refresh_token, res, db)


@router.get(path="/users", response_model=List[UserBaseResponse])
async def get_users(
    _: dict = Depends(require_roles(["Администратор"])),
    db: AsyncSession = Depends(get_async_db),
):
    return await AuthController.get_users(db)


@router.get(path="/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    _: dict = Depends(require_roles(["Администратор"])),
    db: AsyncSession = Depends(get_async_db),
):
    return await AuthController.get_user(user_id, db)


@router.get(path="/me", response_model=UserMe)
async def get_me(
    payload: dict = Depends(require_auth),
    db: AsyncSession = Depends(get_async_db),
):
    return await AuthController.get_me(payload, db)
