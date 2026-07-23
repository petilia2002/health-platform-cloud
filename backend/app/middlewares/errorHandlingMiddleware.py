from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response
from typing import Callable, Awaitable

from app.exceptions.apiError import ApiError


class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        try:
            response = await call_next(request)
            return response

        except ApiError as e:
            return JSONResponse(
                status_code=e.status_code,
                content={"message": e.message, "errors": e.errors},
            )

        except Exception as e:
            return JSONResponse(
                status_code=500,
                content={
                    "message": "Извините, что-то пошло не так...",
                    "error": str(e),
                },
            )
