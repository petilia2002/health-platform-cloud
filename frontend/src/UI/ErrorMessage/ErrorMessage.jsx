import { Button } from "antd";
import errorImage from "../../assets/serverError.jpg";
import classes from "./ErrorMessage.module.css";

export default function ErrorMessage({
  className = "",
  message = "Что-то пошло не так. Попробуйте еще раз позже...",
  retryHandler = () => null,
}) {
  return (
    <div className={`${className} ${classes.errorContainer}`}>
      <img className={classes.errorImg} src={errorImage} alt="Ошибка" />
      <p className={classes.errorTitle}>Произошла ошибка при запросе</p>
      <p className={classes.errorDescription}>{message}</p>
      <Button
        type="primary"
        className={classes.retryBtn}
        onClick={retryHandler}
      >
        Повторить запрос
      </Button>
    </div>
  );
}
