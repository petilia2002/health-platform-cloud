from sqlalchemy import Integer, String, ForeignKey, Boolean, DateTime, Date, Numeric
from sqlalchemy.orm import relationship, Mapped, mapped_column, DeclarativeBase
from datetime import datetime, date
from decimal import Decimal
from typing import List
from app.schemas.schemas import RoleEnum


# Базовый класс для ORM
class Base(DeclarativeBase):
    pass


class Gender(Base):
    __tablename__ = "genders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    # Связь один-ко-многим: один пол может быть у многих пользователей
    users: Mapped[List["User"]] = relationship(
        "User", back_populates="gender", cascade="all, delete-orphan"
    )


class Role(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    # Связь один-ко-многим: одна роль может быть у многих пользователей
    users: Mapped[List["User"]] = relationship(
        "User", back_populates="role", cascade="all, delete-orphan"
    )


class Status(Base):
    __tablename__ = "statuses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    # Связь один-ко-многим: одна роль может быть у многих пользователей
    users: Mapped[List["User"]] = relationship(
        "User", back_populates="status", cascade="all, delete-orphan"
    )


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(512), nullable=False)
    activation_link: Mapped[str] = mapped_column(String(512), nullable=False)
    is_activated: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    registration_date: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.now
    )
    last_name: Mapped[str] = mapped_column(String, nullable=False)
    first_name: Mapped[str] = mapped_column(String, nullable=False)
    middle_name: Mapped[str] = mapped_column(String, nullable=False)
    birth_date: Mapped[date] = mapped_column(Date, nullable=False)
    gender_id: Mapped[int] = mapped_column(
        ForeignKey("genders.id", ondelete="CASCADE"), nullable=False
    )
    city: Mapped[str] = mapped_column(String, nullable=True)
    phone: Mapped[str] = mapped_column(String, nullable=True)
    photo: Mapped[str] = mapped_column(String(512), nullable=True)
    icon: Mapped[str] = mapped_column(String(512), nullable=True)
    status_id: Mapped[int] = mapped_column(
        ForeignKey("statuses.id", ondelete="CASCADE"), nullable=False
    )
    role_id: Mapped[int] = mapped_column(
        ForeignKey("roles.id", ondelete="CASCADE"), nullable=False
    )

    # Связь один к одному
    token: Mapped["Token"] = relationship(
        "Token", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    # Связь один к одному
    patient: Mapped["Patient"] = relationship(
        "Patient", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    # Связь один к одному
    doctor: Mapped["Doctor"] = relationship(
        "Doctor", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )

    # Связь многие-к-одному: многие пользователи могут иметь один пол
    gender: Mapped["Gender"] = relationship("Gender", back_populates="users")
    # Связь многие-к-одному: многие пользователи могут иметь один статус
    status: Mapped["Status"] = relationship("Status", back_populates="users")
    # Связь многие-к-одному: многие пользователи могут иметь одну роль
    role: Mapped["Role"] = relationship("Role", back_populates="users")

    @property
    def profile(self):
        if self.role.name == RoleEnum.doctor:
            return self.doctor
        elif self.role.name == RoleEnum.patient:
            return self.patient
        return None


class Token(Base):
    __tablename__ = "tokens"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    refresh_token: Mapped[str] = mapped_column(String(512), unique=True, nullable=False)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )

    # Обратная связь
    user: Mapped["User"] = relationship("User", back_populates="token")


class Patient(Base):
    __tablename__ = "patients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    height: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=True)
    weight: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=True)
    bmi: Mapped[Decimal] = mapped_column(Numeric(4, 2), nullable=True)
    blood_type: Mapped[str] = mapped_column(String, nullable=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )

    user: Mapped["User"] = relationship("User", back_populates="patient")

    samples: Mapped[List["Sample"]] = relationship(
        "Sample", back_populates="patient", cascade="all, delete-orphan"
    )
    requests: Mapped[List["Request"]] = relationship(
        "Request", back_populates="patient", cascade="all, delete-orphan"
    )


class Doctor(Base):
    __tablename__ = "doctors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    place_employment: Mapped[str] = mapped_column(String(50), nullable=False)
    post: Mapped[str] = mapped_column(String(50), nullable=False)
    specialization: Mapped[str] = mapped_column(String(50), nullable=False)
    education: Mapped[str] = mapped_column(String, nullable=True)
    experience: Mapped[int] = mapped_column(Integer, nullable=True)
    bio: Mapped[str] = mapped_column(String, nullable=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )

    # Обратная связь
    user: Mapped["User"] = relationship("User", back_populates="doctor")

    # Связь один-ко-многим: один доктор может иметь много областей специализации
    expertise_areas: Mapped[List["ExpertiseArea"]] = relationship(
        "ExpertiseArea", back_populates="doctor", cascade="all, delete-orphan"
    )
    requests: Mapped[List["Request"]] = relationship(
        "Request", back_populates="doctor", cascade="all, delete-orphan"
    )


class ExpertiseArea(Base):
    __tablename__ = "expertise_areas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    doctor_id: Mapped[int] = mapped_column(
        ForeignKey("doctors.id", ondelete="CASCADE"), nullable=False
    )

    # Обратная связь
    doctor: Mapped["Doctor"] = relationship("Doctor", back_populates="expertise_areas")


class Sample(Base):
    __tablename__ = "samples"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    upload_date: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.now
    )
    update_date: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.now, onupdate=datetime.now
    )
    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patients.id", ondelete="CASCADE"), nullable=False
    )

    patient: Mapped["Patient"] = relationship("Patient", back_populates="samples")
    sample_results: Mapped[List["SampleResult"]] = relationship(
        "SampleResult", back_populates="sample", cascade="all, delete-orphan"
    )
    predictions: Mapped[List["Prediction"]] = relationship(
        "Prediction", back_populates="sample", cascade="all, delete-orphan"
    )


class Analyte(Base):
    __tablename__ = "analytes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)
    view_name: Mapped[str] = mapped_column(String, nullable=False)
    loinc_code: Mapped[str] = mapped_column(String, nullable=True)
    units: Mapped[str] = mapped_column(String, nullable=False)
    min_val: Mapped[Decimal] = mapped_column(Numeric(7, 2), nullable=False)
    max_val: Mapped[Decimal] = mapped_column(Numeric(7, 2), nullable=False)

    sample_results: Mapped[List["SampleResult"]] = relationship(
        "SampleResult", back_populates="analyte", cascade="all, delete-orphan"
    )
    prediction_results: Mapped[List["PredictionResult"]] = relationship(
        "PredictionResult", back_populates="analyte", cascade="all, delete-orphan"
    )


class SampleResult(Base):
    __tablename__ = "sample_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    value: Mapped[Decimal] = mapped_column(Numeric(6, 2), nullable=False)

    analyte_id: Mapped[int] = mapped_column(
        ForeignKey("analytes.id", ondelete="CASCADE"), nullable=False
    )
    sample_id: Mapped[int] = mapped_column(
        ForeignKey("samples.id", ondelete="CASCADE"), nullable=False
    )

    analyte: Mapped["Analyte"] = relationship(
        "Analyte", back_populates="sample_results"
    )
    sample: Mapped["Sample"] = relationship("Sample", back_populates="sample_results")


class Prediction(Base):
    __tablename__ = "predictions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    description: Mapped[str] = mapped_column(String, nullable=True)
    creation_date: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.now
    )
    update_date: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.now, onupdate=datetime.now
    )
    sample_id: Mapped[int] = mapped_column(
        ForeignKey("samples.id", ondelete="CASCADE"), nullable=False
    )

    sample: Mapped["Sample"] = relationship("Sample", back_populates="predictions")
    prediction_results: Mapped[List["PredictionResult"]] = relationship(
        "PredictionResult", back_populates="prediction", cascade="all, delete-orphan"
    )

    access_predictions: Mapped[List["AccessPrediction"]] = relationship(
        "AccessPrediction", back_populates="prediction", cascade="all, delete-orphan"
    )


class PredictionResult(Base):
    __tablename__ = "prediction_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    conclusion: Mapped[str] = mapped_column(String, nullable=False)
    probability: Mapped[Decimal] = mapped_column(Numeric(6, 4), nullable=False)
    analyte_id: Mapped[int] = mapped_column(
        ForeignKey("analytes.id", ondelete="CASCADE"), nullable=False
    )
    prediction_id: Mapped[int] = mapped_column(
        ForeignKey("predictions.id", ondelete="CASCADE"), nullable=False
    )

    analyte: Mapped["Analyte"] = relationship(
        "Analyte", back_populates="prediction_results"
    )
    prediction: Mapped["Prediction"] = relationship(
        "Prediction", back_populates="prediction_results"
    )


class Request(Base):
    __tablename__ = "requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    creation_date: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.now
    )
    update_date: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.now, onupdate=datetime.now
    )
    status_id: Mapped[int] = mapped_column(
        ForeignKey("request_statuses.id", ondelete="CASCADE"), nullable=False
    )
    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patients.id", ondelete="CASCADE"), nullable=False
    )
    doctor_id: Mapped[int] = mapped_column(
        ForeignKey("doctors.id", ondelete="CASCADE"), nullable=False
    )

    # Обратная связь
    status: Mapped["RequestStatus"] = relationship(
        "RequestStatus", back_populates="requests"
    )
    patient: Mapped["Patient"] = relationship("Patient", back_populates="requests")
    doctor: Mapped["Doctor"] = relationship("Doctor", back_populates="requests")

    access_predictions: Mapped[List["AccessPrediction"]] = relationship(
        "AccessPrediction", back_populates="request", cascade="all, delete-orphan"
    )


class RequestStatus(Base):
    __tablename__ = "request_statuses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)

    # Обратная связь
    requests: Mapped[List["Request"]] = relationship(
        "Request", back_populates="status", cascade="all, delete-orphan"
    )


class AccessPrediction(Base):
    __tablename__ = "access_predictions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    creation_date: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.now
    )
    update_date: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.now, onupdate=datetime.now
    )
    comment_date: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    doctor_comment: Mapped[str] = mapped_column(String, nullable=True)
    access_status: Mapped[str] = mapped_column(String, nullable=False)

    prediction_id: Mapped[int] = mapped_column(
        ForeignKey("predictions.id", ondelete="CASCADE"), nullable=False
    )
    request_id: Mapped[int] = mapped_column(
        ForeignKey("requests.id", ondelete="CASCADE"), nullable=False
    )

    prediction: Mapped["Prediction"] = relationship(
        "Prediction", back_populates="access_predictions"
    )
    request: Mapped["Request"] = relationship(
        "Request", back_populates="access_predictions"
    )
