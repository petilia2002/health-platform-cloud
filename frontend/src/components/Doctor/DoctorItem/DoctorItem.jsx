import { useState } from "react";
import { Tooltip } from "antd";
import { FaLocationDot } from "react-icons/fa6";
import { BiLocationPlus } from "react-icons/bi";
import MyButton from "../../../UI/MyButton/MyButton";
import userSvg from "../../../assets/user.svg";
import classes from "./DoctorItem.module.css";

export default function DoctorItem({
  doctor,
  onCancel,
  onComplete,
  onResubmit,
}) {
  const [loading, setLoading] = useState(false);

  const hasRequest = !!doctor.last_request;
  const status = doctor.last_request?.status;

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
    if (!hasRequest) {
      return (
        <MyButton
          className={classes.btnFilled}
          onClick={() => handleAction(() => onResubmit(doctor.doctor_id))}
          disabled={loading}
        >
          Отправить заявку
        </MyButton>
      );
    }

    switch (status) {
      case "Ожидание":
        return (
          <MyButton
            className={classes.btnOutline}
            onClick={() =>
              handleAction(() => onCancel(doctor.last_request.id, "Отменено"))
            }
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
              handleAction(() =>
                onComplete(doctor.last_request.id, "Завершено"),
              )
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
            onClick={() => handleAction(() => onResubmit(doctor.doctor_id))}
            disabled={loading}
          >
            Отправить заявку
          </MyButton>
        );
    }
  };

  return (
    <div className={classes.doctorCard}>
      <div className={classes.doctorPost}>{doctor.post}</div>
      <div className={classes.cardHeader}>
        <img
          className={classes.doctorIcon}
          src={doctor.icon || userSvg}
          alt="Doctor Image"
        />
        <div className={classes.doctorMain}>
          <h4>
            {doctor.last_name} {doctor.first_name} {doctor.middle_name}
          </h4>
          <p>Стаж {doctor.experience}</p>
        </div>
      </div>
      <div className={classes.doctorAddress}>
        <FaLocationDot className={classes.locationIcon} size={20} />
        <p>
          {doctor.place_employment}, г. {doctor.city}
        </p>
      </div>
      <div className={classes.doctorInfo}>
        <div className={classes.infoGroup}>
          <label>Телефон</label>
          <Tooltip title={doctor.phone}>
            <p>{doctor.phone}</p>
          </Tooltip>
        </div>
        <div className={classes.infoGroup}>
          <label>E-mail</label>
          <Tooltip title={doctor.email}>
            <p>{doctor.email}</p>
          </Tooltip>
        </div>
        <div className={classes.infoGroup}>
          <label>О специалисте</label>
          <p>{doctor.bio}</p>
        </div>
      </div>
      <div className={classes.cardFooter}>
        <div className={classes.icons}>
          <Tooltip title={"Прием в медицинском офисе"}>
            <div className={classes.iconWrapper}>
              <BiLocationPlus className={classes.myIcon} size={22} />
            </div>
          </Tooltip>
        </div>
        {renderActionButton()}
      </div>
    </div>
  );
}
