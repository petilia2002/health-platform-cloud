# cors_static.py
from starlette.staticfiles import StaticFiles
from starlette.responses import Response


class CORSStaticFiles(StaticFiles):
    def __init__(self, *args, cors_origin="*", allow_credentials=False, **kwargs):
        super().__init__(*args, **kwargs)
        self._cors_origin = cors_origin
        self._allow_credentials = allow_credentials

    async def get_response(self, path, scope):
        response = await super().get_response(path, scope)
        # Если ответ — объект Response (FileResponse наследуется от Response) — дополняем заголовки
        if isinstance(response, Response):
            response.headers.setdefault(
                "Access-Control-Allow-Origin", self._cors_origin
            )
            response.headers.setdefault("Access-Control-Allow-Methods", "GET, OPTIONS")
            response.headers.setdefault(
                "Access-Control-Allow-Headers",
                "Origin, Content-Type, Accept, Authorization",
            )
            if self._allow_credentials:
                response.headers.setdefault("Access-Control-Allow-Credentials", "true")
        return response
