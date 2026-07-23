from fastapi import Depends
from typing import List

from app.dependencies.authDependency import require_auth
from app.exceptions.apiError import ApiError


def require_roles(allowed_roles: List[str]):
    async def _role_checker(user: dict = Depends(require_auth)):
        user_role = user.get("role")

        if user_role not in allowed_roles:
            raise ApiError.AccessDeniedError(message="Нет прав доступа")
        return user

    return _role_checker
