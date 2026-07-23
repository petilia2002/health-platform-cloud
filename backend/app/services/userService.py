from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func, and_
from sqlalchemy.orm import selectinload
from typing import Optional

from app.exceptions.apiError import ApiError
from app.models.models import User, Doctor, Patient, Role, Request, RequestStatus
from app.dtos.patientDto import PatientDto
from app.dtos.doctorDto import DoctorDto
from app.dtos.adminDto import AdminDto
from app.dtos.requestDto import PatientRequestDto


class UserService:
    @staticmethod
    async def get_patients(db: AsyncSession):
        stmt = (
            select(User)
            .options(
                selectinload(User.role),
                selectinload(User.gender),
                selectinload(User.patient),
            )
            .join(User.role)
            .where(Role.name == "Пациент")
            .order_by(
                User.last_name.asc(),
                User.first_name.asc(),
                User.middle_name.asc(),
            )
        )
        result = await db.execute(stmt)
        users = result.scalars().all()

        patients = [PatientDto(u, u.patient).to_dict for u in users]
        return patients

    @staticmethod
    async def get_patient_by_id(patient_id: int, db: AsyncSession):
        """Получить данные пациента по его ID"""
        query = (
            select(User, Patient)
            .join(Patient, Patient.user_id == User.id)
            .where(Patient.id == patient_id)
            .options(selectinload(User.gender), selectinload(User.role))
        )
        result = await db.execute(query)

        user, patient = result.first()
        if not patient:
            raise ApiError.BadRequest(f"Пациент с id = {patient_id} не найден")

        return PatientDto(user, patient).to_dict

    @staticmethod
    async def get_patient_by_user_id(user_id: int, db: AsyncSession):
        """Получить ID пациента по ID пользователя"""
        stmt = select(Patient.id).join(Patient.user).where(User.id == user_id)
        result = await db.execute(stmt)
        patient_id = result.scalar_one_or_none()
        return patient_id

    @staticmethod
    async def get_doctors(query: Optional[str], db: AsyncSession):
        stmt = (
            select(User)
            .options(
                selectinload(User.role),
                selectinload(User.gender),
                selectinload(User.doctor),
            )
            .join(User.role)
            .join(User.doctor)
            .where(Role.name == "Врач")
        )

        if query:
            search = f"%{query.strip()}%"
            stmt = stmt.where(
                or_(
                    func.concat(
                        User.last_name, " ", User.first_name, " ", User.middle_name
                    ).ilike(search),
                    Doctor.post.ilike(search),
                    func.concat(Doctor.place_employment, ", г. ", User.city).ilike(
                        search
                    ),
                )
            )

        stmt = stmt.order_by(
            User.last_name.asc(),
            User.first_name.asc(),
            User.middle_name.asc(),
        )

        result = await db.execute(stmt)
        users = result.scalars().all()

        doctors = [DoctorDto(u, u.doctor).to_dict for u in users]
        return doctors

    @staticmethod
    async def get_doctors_with_statuses(
        user_payload: dict, query: Optional[str], db: AsyncSession
    ):
        if not user_payload or not user_payload.get("id"):
            raise ApiError.BadRequest("Не удалось идентифицировать пользователя")

        user_id = user_payload["id"]
        patient_id = await UserService.get_patient_by_user_id(user_id, db)

        # Находим последнюю заявку по каждому врачу
        last_request_subquery = (
            select(
                Request.doctor_id.label("doctor_id"),
                func.max(Request.id).label("latest_request_id"),
            )
            .where(Request.patient_id == patient_id)
            .group_by(Request.doctor_id)
            .subquery()
        )

        # Запрашиваем врачей с последней заявкой для каждого из них
        stmt = (
            select(User, Request)
            .options(
                selectinload(User.role),
                selectinload(User.gender),
                selectinload(User.doctor),
                selectinload(Request.status),
                selectinload(Request.doctor).selectinload(Doctor.user),
            )
            .join(User.role)
            .join(User.doctor)
            .outerjoin(
                last_request_subquery,
                last_request_subquery.c.doctor_id == Doctor.id,
            )
            .outerjoin(Request, Request.id == last_request_subquery.c.latest_request_id)
            .outerjoin(Request.status)
            .where(Role.name == "Врач")
            .order_by(User.last_name, User.first_name, User.middle_name)
        )

        if query:
            search = f"%{query.strip()}%"
            stmt = stmt.where(
                or_(
                    func.concat(
                        User.last_name, " ", User.first_name, " ", User.middle_name
                    ).ilike(search),
                    Doctor.post.ilike(search),
                    func.concat(Doctor.place_employment, ", г. ", User.city).ilike(
                        search
                    ),
                )
            )

        result = await db.execute(stmt)
        rows = result.all()

        doctor_with_statuses = []
        for user, request in rows:
            doctor_data = DoctorDto(user, user.doctor).to_dict
            if request:
                doctor_data.update({"last_request": PatientRequestDto(request)})
            else:
                doctor_data.update(
                    {
                        "last_request": None,
                    }
                )
            doctor_with_statuses.append(doctor_data)

        return doctor_with_statuses

    @staticmethod
    async def get_admins(db: AsyncSession):
        stmt = (
            select(User)
            .options(
                selectinload(User.role),
                selectinload(User.gender),
            )
            .join(User.role)
            .where(Role.name == "Администратор")
            .order_by(
                User.last_name.asc(),
                User.first_name.asc(),
                User.middle_name.asc(),
            )
        )
        result = await db.execute(stmt)
        users = result.scalars().all()

        admins = [AdminDto(u).to_dict for u in users]
        return admins
