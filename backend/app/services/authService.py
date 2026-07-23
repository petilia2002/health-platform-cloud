from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
import uuid
from app.schemas.schemas import (
    UserRegistration,
    LoginData,
    MessageResponse,
    UserLogin,
    RoleEnum,
)
from app.models.models import User, Role, Status, Gender, Doctor, Patient
from app.core.security import async_hash_password, async_verify_password
from app.db.transaction import transactional
from app.services.mailService import mailService
from app.services.tokenService import TokenService
from app.core.config import API_URL
from app.dtos.userDto import UserDto
from app.exceptions.apiError import ApiError


class AuthService:
    @staticmethod
    async def registration(user: UserRegistration, db: AsyncSession):
        # --- распаковываем пришедшие с клиента данные ---
        user_data = {**user.model_dump()}

        # --- проверяем, существует ли уже пользователь с такой почтой ---
        result = await db.execute(select(User).where(User.email == user_data["email"]))
        candidate = result.scalar_one_or_none()
        if candidate:
            raise ApiError.BadRequest(
                message="Пользователь с таким email уже существует"
            )

        # --- создаем зашифрованный пароль и ссылку активации ---
        user_data["password"] = await async_hash_password(user_data["password"])
        # activation_link = f"{API_URL}/auth/activate/{uuid.uuid4().hex}"
        activation_link = f"{uuid.uuid4().hex}"

        # --- запрашиваем из базы требуемые пол, статус и роль ---
        status = "На модерации" if user_data["role"] == "Врач" else "Активный"
        result = await db.execute(
            select(Role, Status, Gender)
            .where(Role.name == user_data["role"])
            .where(Status.name == status)
            .where(Gender.name == user_data["gender"])
        )

        db_role, db_status, db_gender = result.first()

        # --- создаём пользователя ---
        new_user = User(
            email=user_data["email"],
            password=user_data["password"],
            activation_link=activation_link,
            last_name=user_data["last_name"],
            first_name=user_data["first_name"],
            middle_name=user_data["middle_name"],
            birth_date=user_data["birth_date"],
        )
        new_user.gender = db_gender
        new_user.status = db_status
        new_user.role = db_role

        async with transactional(db):
            db.add(new_user)
        await db.refresh(new_user)

        # --- создаём профиль в зависимости от роли ---
        if user_data["role"] == RoleEnum.patient:
            profile = Patient()
            profile.user = new_user
            async with transactional(db):
                db.add(profile)
            await db.refresh(profile)

        elif user_data["role"] == RoleEnum.doctor:
            profile = Doctor(
                place_employment=user_data["place_employment"],
                post=user_data["post"],
                specialization=user_data["specialization"],
            )
            profile.user = new_user
            async with transactional(db):
                db.add(profile)
            await db.refresh(profile)

        elif user_data["role"] == RoleEnum.admin:
            pass

        else:
            raise ApiError.BadRequest(message=f"Неизвестная роль: {user_data['role']}")

        # --- генерируем пару токенов ---
        userDto = UserDto(new_user)
        tokens = TokenService.generate_tokens(
            {
                "id": userDto.id,
                "email": userDto.email,
                "is_activated": userDto.is_activated,
                "role": userDto.role,
            }
        )
        await TokenService.save_refresh_token(userDto.id, tokens["refresh_token"], db)

        # --- отправляем письмо подтверждения ---
        full_link = f"{API_URL}/auth/activate/{activation_link}"
        await mailService.send_activation_mail(to=userDto.email, link=full_link)

        return LoginData(
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
            user=userDto.to_dict,
        )

    @staticmethod
    async def login(user: UserLogin, db: AsyncSession):
        user_data = {**user.model_dump()}

        result = await db.execute(
            select(User)
            .options(
                selectinload(User.role),
                selectinload(User.gender),
                selectinload(User.status),
            )
            .where(User.email == user_data["email"])
        )
        candidate = result.scalar_one_or_none()
        if not candidate:
            raise ApiError.BadRequest(
                message="Пользователь с таким email не существует"
            )

        password_is_valid = await async_verify_password(
            user_data["password"], candidate.password
        )
        if not password_is_valid:
            raise ApiError.BadRequest(message="Введен неверный пароль")

        userDto = UserDto(candidate)
        tokens = TokenService.generate_tokens(
            {
                "id": userDto.id,
                "email": userDto.email,
                "is_activated": userDto.is_activated,
                "role": userDto.role,
            }
        )
        await TokenService.save_refresh_token(userDto.id, tokens["refresh_token"], db)

        return LoginData(
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
            user=userDto.to_dict,
        )

    @staticmethod
    async def logout(refresh_token: str, db: AsyncSession):
        token = await TokenService.find_token(refresh_token, db)
        if token:
            await TokenService.remove_token(refresh_token, db)
        return MessageResponse(message="Пользователь успешно вышел из аккаунта")

    @staticmethod
    async def activate(activation_link: str, db: AsyncSession):
        result = await db.execute(
            select(User).where(User.activation_link == activation_link)
        )
        user = result.scalars().first()
        if not user:
            raise ApiError.BadRequest(message="Неверная ссылка для активации")

        async with transactional(db):
            user.is_activated = True

    @staticmethod
    async def confirm(user_payload: dict, db: AsyncSession):
        if not user_payload or not user_payload.get("id"):
            raise ApiError.UnauthorizationError(
                f"Не удалось идентифицировать текущего пользователя"
            )
        user_id = user_payload["id"]

        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if not user:
            raise ApiError.BadRequest(message=f"Пользователь с id={user_id} не найден")

        activation_link = f"{API_URL}/auth/activate/{user.activation_link}"
        await mailService.send_activation_mail(user.email, activation_link)

    @staticmethod
    async def refresh(refresh_token: str, db: AsyncSession):
        if not refresh_token:
            raise ApiError.UnauthorizationError(message="Refresh-токен отсутствует")

        token = await TokenService.find_token(refresh_token, db)
        if not token:
            raise ApiError.UnauthorizationError(
                message="Такого refresh-токена не существует"
            )

        payload = TokenService.verify_refresh_token(refresh_token)
        if not payload:
            raise ApiError.UnauthorizationError(message="Refresh-токен недействителен")

        result = await db.execute(
            select(User)
            .options(
                selectinload(User.role),
                selectinload(User.gender),
                selectinload(User.status),
            )
            .where(User.id == payload["id"])
        )
        user = result.scalar_one_or_none()
        if not user:
            raise ApiError.UnauthorizationError(
                message="Пользователя с таким refresh-токеном не существует"
            )

        userDto = UserDto(user)
        tokens = TokenService.generate_tokens(
            {
                "id": userDto.id,
                "email": userDto.email,
                "is_activated": userDto.is_activated,
                "role": userDto.role,
            }
        )
        await TokenService.save_refresh_token(userDto.id, tokens["refresh_token"], db)

        return LoginData(
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
            user=userDto.to_dict,
        )

    @staticmethod
    async def get_users(db: AsyncSession):
        result = await db.execute(
            select(User)
            .options(
                selectinload(User.gender),
                selectinload(User.status),
                selectinload(User.role),
            )
            .order_by(User.id.desc())
        )
        users = result.scalars().all()
        return users

    @staticmethod
    async def get_user(user_id: int, db: AsyncSession):
        result = await db.execute(
            select(User)
            .options(
                selectinload(User.gender),
                selectinload(User.status),
                selectinload(User.role),
                selectinload(User.doctor),
                selectinload(User.patient),
            )
            .where(User.id == user_id)
        )
        user = result.scalars().first()
        if not user:
            raise ApiError.BadRequest(f"Пользователя с id = {user_id} не существует")
        return user

    @staticmethod
    async def get_me(payload: dict, db: AsyncSession):
        user_id = payload.get("id")
        if not user_id:
            raise ApiError.UnauthorizationError(
                "Не удалось идентифицировать пользователя"
            )

        result = await db.execute(
            select(User)
            .options(selectinload(User.role), selectinload(User.gender))
            .where(User.id == user_id)
        )
        user = result.scalars().first()
        if not user:
            raise ApiError.BadRequest(f"Пользователя с id = {user_id} не существует")
        return user
