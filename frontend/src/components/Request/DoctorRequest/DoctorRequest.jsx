import { useState } from "react";
import { useNavigate } from "react-router";
import plural from "plural-ru";
import userSvg from "../../../assets/user.svg";
import { FaLocationDot } from "react-icons/fa6";
import { convertUTCToLocal } from "../../../utils/date";
import { parseDate, parseTime } from "../../../utils/parsing";
import { calculateAge } from "../../../utils/date";
import MyButton from "../../../UI/MyButton/MyButton";
import classes from "./DoctorRequest.module.css";

export default function DoctorRequest({
  request,
  onAccept,
  onReject,
  onComplete,
}) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const status = request.status;
  const patientAge = calculateAge(request.patient.birth_date);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      await action();
    } finally {
      setLoading(false);
    }
  };

  // Определяем, какая кнопка должна быть показана
  const renderActionButton = () => {
    switch (status) {
      case "Ожидание":
        return (
          <div className={classes.btnPair}>
            <MyButton
              className={classes.btnFilled}
              onClick={() =>
                handleAction(() => onAccept(request.id, "Активный"))
              }
              disabled={loading}
            >
              Принять
            </MyButton>
            <MyButton
              className={classes.btnOutline}
              onClick={() =>
                handleAction(() => onReject(request.id, "Отклонено"))
              }
              disabled={loading}
            >
              Отклонить
            </MyButton>
          </div>
        );
      case "Активный":
        return (
          <div className={classes.btnPair}>
            <MyButton
              className={classes.btnFilled}
              onClick={() =>
                navigate(`/patients/${request.patient.patient_id}/predictions`)
              }
              disabled={loading}
            >
              Прогнозы
            </MyButton>
            <MyButton
              className={classes.btnOutline}
              onClick={() =>
                handleAction(() => onComplete(request.id, "Завершено"))
              }
              disabled={loading}
            >
              Завершить
            </MyButton>
          </div>
        );
      default:
        return (
          <MyButton
            className={classes.btnFilled}
            onClick={() =>
              navigate(`/patients/${request.patient.patient_id}/predictions`)
            }
            disabled={loading}
          >
            Смотреть прогнозы
          </MyButton>
        );
    }
  };

  return (
    <div className={classes.requestCard}>
      <div className={classes.dateSection}>
        <p>
          {parseDate(convertUTCToLocal(request.creation_date))} в{" "}
          {parseTime(convertUTCToLocal(request.creation_date))}
        </p>
      </div>
      <div className={classes.mainContent}>
        <a
          href={
            request.patient.icon ||
            "https://new-er.mz63.ru/img/user-photo/def.svg"
          }
          target="_blank"
        >
          <img src={request.patient.icon || userSvg} />
        </a>
        <div className={classes.cardInfo}>
          <h5>
            {request.patient.last_name} {request.patient.first_name}{" "}
            {request.patient.middle_name}
          </h5>
          <div className={classes.patientStatus}>
            <div className={classes.age}>
              {patientAge} {plural(patientAge, "год", "года", "лет")}
            </div>
            <div className={classes.location}>
              <FaLocationDot className={classes.locationIcon} size={15} />
              <p>г. {request.patient.city}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.btnSection}>{renderActionButton()}</div>
    </div>
  );
}
