from typing import List, Any


class ApiError(Exception):
    def __init__(self, status_code: int, message: str, errors: List[Any] = []):
        self.status_code = status_code
        self.message = message
        self.errors = errors

    @staticmethod
    def BadRequest(message: str, errors: List[Any] = []):
        return ApiError(status_code=400, message=message, errors=errors)

    @staticmethod
    def UnauthorizationError(message: str, errors: List[Any] = []):
        return ApiError(status_code=401, message=message, errors=errors)

    @staticmethod
    def AccessDeniedError(message: str, errors: List[Any] = []):
        return ApiError(status_code=403, message=message, errors=errors)

    @staticmethod
    def FileSystemError(message: str, errors: List[Any] = []):
        return ApiError(status_code=500, message=message, errors=errors)

    @staticmethod
    def InternalServerError(message: str, errors: List[Any] = []):
        return ApiError(status_code=500, message=message, errors=errors)
