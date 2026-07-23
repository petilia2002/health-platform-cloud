import { useNavigate } from "react-router";
import NotRequests from "../../assets/no_requests.jpg";
import NotFound from "../../assets/not_found.jpg";
import MyButton from "../../UI/MyButton/MyButton";
import classes from "./EmptyRequests.module.css";

export default function EmptyRequests({
  role,
  statusMessages,
  status,
  searchValue,
  onClearSearch,
}) {
  const navigate = useNavigate();
  const message = statusMessages[status] || statusMessages["Ожидание"];

  if (searchValue) {
    return (
      <div className={classes.notfoundSection}>
        <img src={NotFound} width={250} />
        <p className={classes.notfoundDescription}>
          По запросу "{searchValue}" ничего не найдено
        </p>
        <p className={classes.notfoundAction}>
          Попробуйте изменить поисковый запрос или проверьте правильность ввода
        </p>
        <MyButton className={classes.notfoundBtn} onClick={onClearSearch}>
          Сбросить поиск
        </MyButton>
      </div>
    );
  } else {
    return (
      <div className={classes.notfoundSection}>
        <img src={NotRequests} width={250} />
        <p className={classes.notfoundDescription}>{message.description}</p>
        <p className={classes.notfoundAction}>{message.action}</p>
        {status === "Ожидание" && role === "Пациент" && (
          <MyButton
            className={classes.notfoundBtn}
            onClick={() => navigate("/doctors")}
          >
            Найти врача
          </MyButton>
        )}
      </div>
    );
  }
}
