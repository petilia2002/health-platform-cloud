import jwt
from datetime import datetime, timedelta, timezone
from typing import Any, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.core.config import JWT_ACCESS_KEY, JWT_REFRESH_KEY
from app.db.transaction import transactional
from app.models.models import Token
from app.schemas.schemas import TokenResponse


class TokenService:
    @staticmethod
    def generate_tokens(user: Dict[str, Any]) -> Dict[str, str]:
        access_token = jwt.encode(
            payload={
                **user,
                "iat": datetime.now(timezone.utc),
                "exp": datetime.now(timezone.utc) + timedelta(days=30),
            },
            key=JWT_ACCESS_KEY,
            algorithm="HS256",
        )

        refresh_token = jwt.encode(
            payload={
                **user,
                "iat": datetime.now(timezone.utc),
                "exp": datetime.now(timezone.utc) + timedelta(days=30),
            },
            key=JWT_REFRESH_KEY,
            algorithm="HS256",
        )
        return {"access_token": access_token, "refresh_token": refresh_token}

    @staticmethod
    async def save_refresh_token(user_id: int, refresh_token: str, db: AsyncSession):
        result = await db.execute(select(Token).where(Token.user_id == user_id))
        found_token = result.scalar_one_or_none()

        if found_token:
            async with transactional(db):
                found_token.refresh_token = refresh_token
            await db.refresh(found_token)
            return TokenResponse.model_validate(found_token)
        else:
            async with transactional(db):
                new_token = Token(user_id=user_id, refresh_token=refresh_token)
                db.add(new_token)
            await db.refresh(new_token)
            return TokenResponse.model_validate(new_token)

    @staticmethod
    def payload_proprocessing(payload, time_fields):
        for field in time_fields:
            if field in payload:
                payload[field] = datetime.fromtimestamp(payload[field], tz=timezone.utc)
        return payload

    @staticmethod
    def verify_access_token(token: str) -> Dict[str, Any] | None:
        try:
            payload = jwt.decode(jwt=token, key=JWT_ACCESS_KEY, algorithms=["HS256"])
            return TokenService.payload_proprocessing(payload, ["iat", "exp"])
        except Exception:
            return None

    @staticmethod
    def verify_refresh_token(token: str) -> Dict[str, Any] | None:
        try:
            payload = jwt.decode(jwt=token, key=JWT_REFRESH_KEY, algorithms=["HS256"])
            return TokenService.payload_proprocessing(payload, ["iat", "exp"])
        except Exception:
            return None

    @staticmethod
    async def find_token(refresh_token: str, db: AsyncSession):
        result = await db.execute(
            select(Token).where(Token.refresh_token == refresh_token)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def remove_token(refresh_token: str, db: AsyncSession):
        async with transactional(db):
            await db.execute(delete(Token).where(Token.refresh_token == refresh_token))
