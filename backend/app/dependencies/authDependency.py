from fastapi import Request

from app.exceptions.apiError import ApiError
from app.services.tokenService import TokenService


async def require_auth(request: Request):
    header = request.headers.get("Authorization")

    if not header or not header.startswith("Bearer"):
        raise ApiError.UnauthorizationError(
            message="Заголовок авторизации отсутствует или содержит токен доступа недопустимого формата"
        )

    terms = header.split(" ")
    if len(terms) != 2:
        raise ApiError.UnauthorizationError(message="Access-токен отсутствует")

    token = terms[-1]
    payload = TokenService.verify_access_token(token)
    if not payload:
        raise ApiError.UnauthorizationError(message="Невалидный access-токен")

    request.state.user_payload = payload
    return payload
