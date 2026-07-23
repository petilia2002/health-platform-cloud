import { useNavigate } from "react-router";
import { MdEdit, MdCancelScheduleSend } from "react-icons/md";
import { FaNoteSticky } from "react-icons/fa6";
import { BiSolidLockOpen } from "react-icons/bi";
import MyButton from "../../../UI/MyButton/MyButton";
import classes from "./AccessBtn.module.css";

export default function AccessBtn({
  id,
  sampleId,
  status,
  comment,
  createAccess,
  updateAccess,
}) {
  const navigate = useNavigate();

  const renderBtn = () => {
    if (comment) {
      if (status === "Активный") {
        return (
          <MyButton
            className={classes.accessBtn}
            onClick={() => updateAccess(id, "Завершено")}
          >
            <MdCancelScheduleSend size={18} />
            <p>Закрыть доступ</p>
          </MyButton>
        );
      } else {
        return (
          <MyButton
            className={classes.accessBtn}
            onClick={() => updateAccess(id, "Активный")}
          >
            <BiSolidLockOpen size={20} />
            <p>Открыть доступ</p>
          </MyButton>
        );
      }
    } else {
      if (status === "Активный") {
        return (
          <MyButton
            className={classes.accessBtn}
            onClick={() => updateAccess(id, "Завершено")}
          >
            <MdCancelScheduleSend size={18} />
            <p>Отменить запрос</p>
          </MyButton>
        );
      } else {
        return (
          <MyButton className={classes.accessBtn} onClick={createAccess}>
            <MdEdit size={18} />
            <p>Запросить коментарий</p>
          </MyButton>
        );
      }
    }
  };

  return (
    <div className={classes.btnSection}>
      {renderBtn()}
      <MyButton
        className={classes.accessBtn}
        onClick={() => navigate(`/tests/${sampleId}`)}
      >
        <FaNoteSticky size={18} />
        <p>Посмотреть анализ</p>
      </MyButton>
    </div>
  );
}
