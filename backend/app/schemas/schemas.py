from pydantic import BaseModel, EmailStr
from pydantic_core import PydanticCustomError
from datetime import datetime, date
from typing import Optional, Dict, Any
import enum
from pydantic import BaseModel, Field, field_validator, EmailStr


# РОЛИ:
class RoleEnum(str, enum.Enum):
    patient = "Пациент"
    doctor = "Врач"
    admin = "Администратор"


# ВХОДНЫЕ ДАННЫЕ ПРИ РЕГИСТРАЦИИ:
class UserBaseRegistration(BaseModel):
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(..., min_length=4, max_length=24, description="Password")
    last_name: str = Field(..., description="Last name")
    first_name: str = Field(..., description="First name")
    middle_name: str = Field(..., description="Middle name")
    gender: str = Field(..., min_length=1, max_length=50, description="Gender")
    birth_date: date = Field(..., description="Date of birth")

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if " " in v:
            raise PydanticCustomError(
                "password_whitespace",
                "Password must not contain spaces",
                {"invalid_value": v},
            )
        return v


class PatientRegistration(UserBaseRegistration):
    role: str = Field(..., min_length=1, max_length=50, description="User role")


class DoctorRegistration(UserBaseRegistration):
    role: str = Field(..., min_length=1, max_length=50, description="User role")
    place_employment: str = Field(..., min_length=1, max_length=50)
    post: str = Field(..., min_length=1, max_length=50)
    specialization: str = Field(..., min_length=1, max_length=50)


class AdminRegistration(UserBaseRegistration):
    role: str = Field(..., min_length=1, max_length=50, description="User role")


UserRegistration = PatientRegistration | DoctorRegistration | AdminRegistration


# ОТВЕТ СЕРВЕРА ПРИ РЕГИСТРАЦИИ:


class RoleResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class StatusResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class GenderResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class UserBaseResponse(BaseModel):
    id: int
    email: str
    password: str
    activation_link: str
    is_activated: bool
    registration_date: datetime
    last_name: str
    first_name: str
    middle_name: str
    gender: GenderResponse
    birth_date: date
    city: Optional[str]
    phone: Optional[str]
    photo: Optional[str]
    status: StatusResponse
    role: RoleResponse

    class Config:
        from_attributes = True


class PatientResponse(BaseModel):
    id: int
    height: Optional[int]
    weight: Optional[int]
    bmi: Optional[float]
    blood_type: Optional[str]
    user_id: int

    class Config:
        from_attributes = True


class DoctorResponse(BaseModel):
    id: int
    place_employment: str
    post: str
    specialization: str
    education: Optional[str]
    experience: Optional[str]
    bio: Optional[str]
    raiting: Optional[float]
    user_id: int

    class Config:
        from_attributes = True


class UserResponse(UserBaseResponse):
    profile: DoctorResponse | PatientResponse | None


# АВТОРИЗАЦИЯ
class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(..., min_length=4, max_length=24, description="Password")

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if " " in v:
            raise PydanticCustomError(
                "password_whitespace",
                "Password must not contain spaces",
                {"invalid_value": v},
            )
        return v


class LoginData(BaseModel):
    access_token: str
    refresh_token: str
    user: Dict[str, Any]


class UserMe(BaseModel):
    id: int
    email: str
    is_activated: bool
    last_name: str
    first_name: str
    middle_name: str
    gender: GenderResponse
    role: RoleResponse

    class Config:
        from_attributes = True


# TOKEN:
class TokenBase(BaseModel):
    user_id: int
    refresh_token: str


class TokenResponse(TokenBase):
    id: int

    class Config:
        from_attributes = True


# MESSAGE:
class MessageResponse(BaseModel):
    message: str


# АНАЛИЗЫ КРОВИ:
class BloodTestCreate(BaseModel):
    ferritin: Optional[float] = Field(
        None,
        ge=0.01,
        le=1667.2,
        description="Уровень ферритина должен находиться в диапазоне от 0.01 до 1667.2",
    )
    b12: Optional[float] = Field(
        None,
        ge=1.0,
        le=39833.0,
        description="Уровень В12 должен находиться в диапазоне от 1.0 до 39833.0",
    )
    folic: Optional[float] = Field(
        None,
        ge=0.56,
        le=330.11,
        description="Уровень фолиевой кислоты должен находиться в диапазоне от 0.56 до 330.11",
    )
    ast: Optional[float] = Field(
        None,
        ge=0.3,
        le=1518.5,
        description="Уровень АСТ должен находиться в диапазоне от 0.3 до 1518.5",
    )
    alt: Optional[float] = Field(
        None,
        ge=0.1,
        le=1721.4,
        description="Уровень АЛТ должен находиться в диапазоне от 0.1 до 1721.4",
    )
    bil_direct: Optional[float] = Field(
        None,
        ge=0.04,
        le=238.4,
        description="Уровень связанного билирубина должен находиться в диапазоне от 0.03 до 238.4",
    )
    bil_indirect: Optional[float] = Field(
        None,
        ge=0.05,
        le=220.79,
        description="Уровень свободного билирубина должен находиться в диапазоне от 0.05 до 220.79",
    )
    bil_total: Optional[float] = Field(
        None,
        ge=0.03,
        le=432.43,
        description="Уровень общего билирубина должен находиться в диапазоне от 0.03 до 432.43",
    )
    crea: Optional[float] = Field(
        None,
        ge=0.3,
        le=1618.8,
        description="Уровень креатинина должен находиться в диапазоне от 0.3 до 1618.8",
    )
    urea: Optional[float] = Field(
        None,
        ge=0.5,
        le=67.5,
        description="Уровень мочевины должен находиться в диапазоне от 0.5 до 67.5",
    )
    pro: Optional[float] = Field(
        None,
        ge=19.2,
        le=132.1,
        description="Уровень общего белка должен находиться в диапазоне от 19.2 до 132.1",
    )
    ldg: Optional[float] = Field(
        None,
        ge=2.0,
        le=4983.0,
        description="Уровень ЛДГ должен находиться в диапазоне от 2.0 до 4983.0",
    )
    chol: Optional[float] = Field(
        None,
        ge=0.02,
        le=17.2,
        description="Уровень холестерина должен находиться в диапазоне от 0.02 до 17.2",
    )
    glu: Optional[float] = Field(
        None,
        ge=0.01,
        le=26.77,
        description="Уровень глюкозы должен находиться в диапазоне от 0.01 до 26.77",
    )
    uric: Optional[float] = Field(
        None,
        ge=0.0,
        le=1.22,
        description="Уровень мочевой кислоты должен находиться в диапазоне от 0.0 до 1.22",
    )
    alb: Optional[float] = Field(
        None,
        ge=0.04,
        le=60.14,
        description="Уровень альбумина должен находиться в диапазоне от 0.04 до 60.14",
    )
    hgb: float = Field(
        ...,
        ge=11.0,
        le=215.0,
        description="Уровень гемоглобина должен находиться в диапазоне от 11.0 до 215.0",
    )
    rbc: float = Field(
        ...,
        ge=0.24,
        le=8.21,
        description="Уровень эритроцитов должен находиться в диапазоне от 0.24 до 8.21",
    )
    mcv: float = Field(
        ...,
        ge=0.7,
        le=134.0,
        description="Уровень MCV должен находиться в диапазоне от 0.7 до 134.0",
    )
    wbc: float = Field(
        ...,
        ge=0.1,
        le=68.7,
        description="Уровень лейкоцитов должен находиться в диапазоне от 0.1 до 68.7",
    )
    plt: float = Field(
        ...,
        ge=1.0,
        le=1053.0,
        description="Уровень тромбоцитов должен находиться в диапазоне от 1.0 до 1053.0",
    )
    neut: float = Field(
        ...,
        ge=2.9,
        le=100.0,
        description="Уровень нейтрофилов должен находиться в диапазоне от 2.9 до 100.0",
    )
    lymph: float = Field(
        ...,
        ge=0.1,
        le=90.7,
        description="Уровень лифмоцитов должен находиться в диапазоне от 0.1 до 90.7",
    )
    eo: float = Field(
        ...,
        ge=0.09,
        le=43.8,
        description="Уровень эозинофилы должен находиться в диапазоне от 0.09 до 43.8",
    )
    baso: float = Field(
        ...,
        ge=0.02,
        le=27.2,
        description="Уровень базофилы должен находиться в диапазоне от 0.02 до 27.2",
    )
    mono: float = Field(
        ...,
        ge=0.1,
        le=55.4,
        description="Уровень моноциты должен находиться в диапазоне от 0.1 до 55.4",
    )
    crp: Optional[float] = Field(
        None,
        ge=0.01,
        le=250.95,
        description="Уровень СРБ должен находиться в диапазоне от 0.01 до 250.95",
    )
    mid: Optional[float] = Field(
        None,
        ge=1.2,
        le=29.4,
        description="Уровень средних клеток должен находиться в диапазоне от 1.2 до 29.4",
    )
    gra: Optional[float] = Field(
        None,
        ge=14.7,
        le=94.7,
        description="Уровень гранулоцитов должен находиться в диапазоне от 14.7 до 94.7",
    )


class BloodTestUpdate(BloodTestCreate):
    hgb: Optional[float] = Field(
        None,
        ge=11.0,
        le=215.0,
        description="Уровень гемоглобина должен находиться в диапазоне от 11.0 до 215.0",
    )
    rbc: Optional[float] = Field(
        None,
        ge=0.24,
        le=8.21,
        description="Уровень эритроцитов должен находиться в диапазоне от 0.24 до 8.21",
    )
    mcv: Optional[float] = Field(
        None,
        ge=0.7,
        le=134.0,
        description="Уровень MCV должен находиться в диапазоне от 0.7 до 134.0",
    )
    wbc: Optional[float] = Field(
        None,
        ge=0.1,
        le=68.7,
        description="Уровень лейкоцитов должен находиться в диапазоне от 0.1 до 68.7",
    )
    plt: Optional[float] = Field(
        None,
        ge=1.0,
        le=1053.0,
        description="Уровень тромбоцитов должен находиться в диапазоне от 1.0 до 1053.0",
    )
    neut: Optional[float] = Field(
        None,
        ge=2.9,
        le=100.0,
        description="Уровень нейтрофилов должен находиться в диапазоне от 2.9 до 100.0",
    )
    lymph: Optional[float] = Field(
        None,
        ge=0.1,
        le=90.7,
        description="Уровень лифмоцитов должен находиться в диапазоне от 0.1 до 90.7",
    )
    eo: Optional[float] = Field(
        None,
        ge=0.09,
        le=43.8,
        description="Уровень эозинофилы должен находиться в диапазоне от 0.09 до 43.8",
    )
    baso: Optional[float] = Field(
        None,
        ge=0.02,
        le=27.2,
        description="Уровень базофилы должен находиться в диапазоне от 0.02 до 27.2",
    )
    mono: Optional[float] = Field(
        None,
        ge=0.1,
        le=55.4,
        description="Уровень моноциты должен находиться в диапазоне от 0.1 до 55.4",
    )


class UserProfileData(BaseModel):
    email: EmailStr
    last_name: str
    first_name: str
    middle_name: str
    gender: str
    birth_date: date
    city: Optional[str] = None
    phone: Optional[str] = None
    cur_password: Optional[str] = None
    new_password: Optional[str] = None


class PatientProfileData(BaseModel):
    height: Optional[float] = None
    weight: Optional[float] = None
    bmi: Optional[float] = None
    blood_type: Optional[str] = None


class DoctorProfileData(BaseModel):
    place_employment: str
    post: str
    specialization: str
    education: Optional[str] = None
    experience: Optional[int] = None
    bio: Optional[str] = None


class RequestCreate(BaseModel):
    doctor_id: int


class RequestUpdate(BaseModel):
    status: str


class RequestCreateResponse(BaseModel):
    id: int
    creation_date: datetime
    update_date: datetime
    status: str

    class Config:
        from_attributes = True


class RequestUpdateResponse(BaseModel):
    id: int
    creation_date: datetime
    update_date: datetime
    doctor_id: int
    patient_id: int
    status_id: int

    class Config:
        from_attributes = True


class AccessPredictionRequest(BaseModel):
    prediction_id: int
    request_id: int


class AccessPredictionUpdate(BaseModel):
    access_status: str


class AccessPredictionComment(BaseModel):
    doctor_comment: str
