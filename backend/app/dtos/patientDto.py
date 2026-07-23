from typing import Dict, Any

from app.core.config import API_URL
from app.models.models import User, Patient


class PatientDto:
    def __init__(self, user: User, patient: Patient):
        self.id = user.id
        self.email = user.email
        self.last_name = user.last_name
        self.first_name = user.first_name
        self.middle_name = user.middle_name
        self.gender = user.gender.name
        self.birth_date = user.birth_date
        self.city = user.city
        self.phone = user.phone
        self.photo = f"{API_URL}/api/upload/photos/{user.photo}" if user.photo else None
        self.icon = f"{API_URL}/api/upload/icons/{user.icon}" if user.icon else None
        self.role = user.role.name
        self.is_activated = user.is_activated

        self.height = patient.height
        self.weight = patient.weight
        self.bmi = patient.bmi
        self.blood_type = patient.blood_type
        self.patient_id = patient.id

    @property
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "email": self.email,
            "last_name": self.last_name,
            "first_name": self.first_name,
            "middle_name": self.middle_name,
            "gender": self.gender,
            "birth_date": self.birth_date,
            "city": self.city,
            "phone": self.phone,
            "photo": self.photo,
            "icon": self.icon,
            "role": self.role,
            "is_activated": self.is_activated,
            "height": self.height,
            "weight": self.weight,
            "bmi": self.bmi,
            "blood_type": self.blood_type,
            "patient_id": self.patient_id,
        }
