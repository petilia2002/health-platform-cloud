from typing import Dict, Any

from app.core.config import API_URL
from app.models.models import User


class UserDto:
    def __init__(self, model: User):
        self.id = model.id
        self.email = model.email
        self.is_activated = model.is_activated
        self.last_name = model.last_name
        self.first_name = model.first_name
        self.middle_name = model.middle_name
        self.role = model.role.name
        self.gender = model.gender.name
        self.status = model.status.name
        self.photo = model.photo
        self.icon = model.icon

    @property
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "email": self.email,
            "is_activated": self.is_activated,
            "last_name": self.last_name,
            "first_name": self.first_name,
            "middle_name": self.middle_name,
            "role": self.role,
            "gender": self.gender,
            "status": self.status,
            "photo_url": (
                f"{API_URL}/api/upload/photos/{self.photo}" if self.photo else None
            ),
            "icon_url": (
                f"{API_URL}/api/upload/icons/{self.icon}" if self.icon else None
            ),
        }
