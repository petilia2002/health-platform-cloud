import { useState } from "react";
import { convertUTCToLocal } from "../../../utils/date";
import { parseDate, parseTime } from "../../../utils/parsing";
import MyButton from "../../../UI/MyButton/MyButton";
import userSvg from "../../../assets/user.svg";
import classes from "./PatientRequest.module.css";

export default function PatientRequest({
  request,
  onCancel,
  onComplete,
  onResubmit,
}) {
  const [loading, setLoading] = useState(false);
  const status = request.status;

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
          <MyButton
            className={classes.btnOutline}
            onClick={() => handleAction(() => onCancel(request.id, "Отменено"))}
            disabled={loading}
          >
            Отменить заявку
          </MyButton>
        );
      case "Активный":
        return (
          <MyButton
            className={classes.btnOutline}
            onClick={() =>
              handleAction(() => onComplete(request.id, "Завершено"))
            }
            disabled={loading}
          >
            Завершить прием
          </MyButton>
        );
      default:
        return (
          <MyButton
            className={classes.btnFilled}
            onClick={() =>
              handleAction(() => onResubmit(request.doctor.doctor_id))
            }
            disabled={loading}
          >
            Записаться снова
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
        <a href={request.doctor.icon} target="_blank">
          <img src={request.doctor.icon || userSvg} />
        </a>
        <div className={classes.cardInfo}>
          <h5>
            {request.doctor.last_name} {request.doctor.first_name}{" "}
            {request.doctor.middle_name}
          </h5>
          <p>{request.doctor.post}</p>
        </div>
      </div>
      <div className={classes.btnSection}>{renderActionButton()}</div>
    </div>
  );
}
