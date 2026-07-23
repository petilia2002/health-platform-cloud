import httpx

from app.core.config import ULM_URL, ULM_ACCESS_KEY
from app.ml.predict import run_mlp, run_ulm


class ModelService:
    @staticmethod
    async def get_prediction_from_api(sample, params):
        data = [{"sample": sample, "results": params}]
        async with httpx.AsyncClient() as client:
            response = await client.post(
                ULM_URL,
                headers={"Authorization": ULM_ACCESS_KEY},
                json=data,
                timeout=15.0,  # таймаут для избежания зависаний
            )

            response.raise_for_status()  # вызовет исключение при ошибке HTTP
            return response.json()

    @staticmethod
    def create_prediction_with_mlp(sample, params):
        data = [{"sample": sample, "results": params}]
        response = run_mlp(data)
        return response

    @staticmethod
    def create_prediction_with_ulm(sample, params):
        data = [{"sample": sample, "results": params}]
        response = run_ulm(data)
        return response
