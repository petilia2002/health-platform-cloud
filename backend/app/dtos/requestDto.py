from typing import Dict, Any
from app.models.models import Request

from app.core.config import API_URL


class PatientRequestDto:
    def __init__(self, model: Request):
        self.id = model.id
        self.creation_date = model.creation_date
        self.update_date = model.update_date
        self.status = model.status.name
        self.patient_id = model.patient_id
        self.doctor = {
            "id": model.doctor.user.id,
            "email": model.doctor.user.email,
            "last_name": model.doctor.user.last_name,
            "first_name": model.doctor.user.first_name,
            "middle_name": model.doctor.user.middle_name,
            "phone": model.doctor.user.phone,
            "city": model.doctor.user.city,
            "icon": (
                f"{API_URL}/api/upload/icons/{model.doctor.user.icon}"
                if model.doctor.user.icon
                else None
            ),
            "post": model.doctor.post,
            "place_employment": model.doctor.place_employment,
            "bio": model.doctor.bio,
            "doctor_id": model.doctor.id,
        }

    @property
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "creation_date": self.creation_date,
            "update_date": self.update_date,
            "status": self.status,
            "patient_id": self.patient_id,
            "doctor": self.doctor,
        }


class DoctorRequestDto:
    def __init__(self, model: Request):
        self.id = model.id
        self.creation_date = model.creation_date
        self.update_date = model.update_date
        self.status = model.status.name
        self.doctor_id = model.doctor_id
        self.patient = {
            "id": model.patient.user.id,
            "email": model.patient.user.email,
            "last_name": model.patient.user.last_name,
            "first_name": model.patient.user.first_name,
            "middle_name": model.patient.user.middle_name,
            "phone": model.patient.user.phone,
            "city": model.patient.user.city,
            "birth_date": model.patient.user.birth_date,
            "icon": (
                f"{API_URL}/api/upload/icons/{model.patient.user.icon}"
                if model.patient.user.icon
                else None
            ),
            "blood_type": model.patient.blood_type,
            "patient_id": model.patient.id,
        }

    @property
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "creation_date": self.creation_date,
            "update_date": self.update_date,
            "status": self.status,
            "doctor_id": self.doctor_id,
            "patient": self.patient,
        }


class AdminRequestDto:
    def __init__(self, model: Request):
        self.id = model.id
        self.creation_date = model.creation_date
        self.update_date = model.update_date
        self.status = model.status.name
        self.patient = {
            "id": model.patient.user.id,
            "email": model.patient.user.email,
            "last_name": model.patient.user.last_name,
            "first_name": model.patient.user.first_name,
            "middle_name": model.patient.user.middle_name,
            "phone": model.patient.user.phone,
            "city": model.patient.user.city,
            "birth_date": model.patient.user.birth_date,
            "icon": (
                f"{API_URL}/api/upload/icons/{model.patient.user.icon}"
                if model.patient.user.icon
                else None
            ),
            "blood_type": model.patient.blood_type,
            "patient_id": model.patient.id,
        }
        self.doctor = {
            "id": model.doctor.user.id,
            "email": model.doctor.user.email,
            "last_name": model.doctor.user.last_name,
            "first_name": model.doctor.user.first_name,
            "middle_name": model.doctor.user.middle_name,
            "phone": model.doctor.user.phone,
            "city": model.doctor.user.city,
            "icon": (
                f"{API_URL}/api/upload/icons/{model.doctor.user.icon}"
                if model.doctor.user.icon
                else None
            ),
            "post": model.doctor.post,
            "place_employment": model.doctor.place_employment,
            "bio": model.doctor.bio,
            "doctor_id": model.doctor.id,
        }

    @property
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "creation_date": self.creation_date,
            "update_date": self.update_date,
            "status": self.status,
            "doctor": self.doctor,
            "patient": self.patient,
        }
