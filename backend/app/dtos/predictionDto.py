from typing import List, Optional
from datetime import datetime

from app.core.config import API_URL
from app.models.models import (
    Prediction,
    AccessPrediction,
)


class PredictionResultDto:
    def __init__(
        self,
        id: int,
        analyte_name: str,
        analyte_view_name: str,
        conclusion: str,
        probability: float,
    ):
        self.id = id
        self.analyte_name = analyte_name
        self.analyte_view_name = analyte_view_name
        self.conclusion = conclusion
        self.probability = probability

    def to_dict(self):
        return {
            "id": self.id,
            "analyte_name": self.analyte_name,
            "analyte_view_name": self.analyte_view_name,
            "conclusion": self.conclusion,
            "probability": self.probability,
        }


class RequestDto:
    def __init__(self, id: int, status: str):
        self.id = id
        self.status = status

    def to_dict(self):
        return {
            "id": self.id,
            "status": self.status,
        }


class AccessDto:
    def __init__(self, id: int, status: str):
        self.id = id
        self.status = status

    def to_dict(self):
        return {
            "id": self.id,
            "status": self.status,
        }


class DoctorDto:
    def __init__(
        self,
        user_id: int,
        doctor_id: int,
        last_name: str,
        first_name: str,
        middle_name: str,
        post: str,
        icon: Optional[str] = None,
    ):
        self.user_id = user_id
        self.doctor_id = doctor_id
        self.last_name = last_name
        self.first_name = first_name
        self.middle_name = middle_name
        self.post = post
        self.icon = f"{API_URL}/api/upload/icons/{icon}" if icon else None

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "doctor_id": self.doctor_id,
            "last_name": self.last_name,
            "first_name": self.first_name,
            "middle_name": self.middle_name,
            "post": self.post,
            "icon": self.icon,
        }


class PredictionResponseDto:
    def __init__(
        self,
        id: int,
        creation_date: datetime,
        update_date: datetime,
        sample_id: int,
        doctor_comment: Optional[str],
        comment_date: Optional[datetime],
        results: List[PredictionResultDto],
        request: Optional[RequestDto],
        access: Optional[AccessDto],
        doctor: Optional[DoctorDto],
    ):
        self.id = id
        self.creation_date = creation_date
        self.update_date = update_date
        self.sample_id = sample_id
        self.doctor_comment = doctor_comment
        self.comment_date = comment_date
        self.results = results
        self.request = request
        self.access = access
        self.doctor = doctor

    def to_dict(self):
        return {
            "id": self.id,
            "creation_date": self.creation_date,
            "update_date": self.update_date,
            "sample_id": self.sample_id,
            "doctor_comment": self.doctor_comment,
            "comment_date": self.comment_date,
            "results": [
                result.to_dict() for result in sorted(self.results, key=lambda r: r.id)
            ],
            "request": self.request.to_dict() if self.request else None,
            "access": self.access.to_dict() if self.access else None,
            "doctor": self.doctor.to_dict() if self.doctor else None,
        }


class PredictionDtoBuilder:
    @staticmethod
    def build_from_access_prediction(
        prediction: Prediction,
        access_pred: Optional[AccessPrediction] = None,
    ) -> PredictionResponseDto:
        # Преобразуем результаты
        results_dto = [
            PredictionResultDto(
                id=result.id,
                analyte_name=result.analyte.name,
                analyte_view_name=result.analyte.view_name,
                conclusion=result.conclusion,
                probability=result.probability,
            )
            for result in prediction.prediction_results
        ]

        # Создаем DTO для запроса
        request_dto = (
            RequestDto(
                id=access_pred.request.id, status=access_pred.request.status.name
            )
            if access_pred
            else None
        )

        # Создаем DTO для доступа
        access_dto = (
            AccessDto(id=access_pred.id, status=access_pred.access_status)
            if access_pred
            else None
        )

        # Создаем DTO для доктора
        doctor_dto = (
            DoctorDto(
                user_id=access_pred.request.doctor.user_id,
                doctor_id=access_pred.request.doctor.id,
                last_name=access_pred.request.doctor.user.last_name,
                first_name=access_pred.request.doctor.user.first_name,
                middle_name=access_pred.request.doctor.user.middle_name,
                post=access_pred.request.doctor.post,
                icon=access_pred.request.doctor.user.icon,
            )
            if access_pred
            else None
        )

        # Создаем комментарий врача и дату комментария
        doctor_comment = access_pred.doctor_comment if access_pred else None
        comment_date = access_pred.comment_date if access_pred else None

        # Собираем финальный DTO
        return PredictionResponseDto(
            id=prediction.id,
            creation_date=prediction.creation_date,
            update_date=prediction.update_date,
            sample_id=prediction.sample_id,
            doctor_comment=doctor_comment,
            comment_date=comment_date,
            results=results_dto,
            request=request_dto,
            access=access_dto,
            doctor=doctor_dto,
        )
