import NotFound from "../../../assets/doctors_not_found.png";
import MyButton from "../../../UI/MyButton/MyButton";
import classes from "./DoctorNotFound.module.css";

export default function DoctorNotFound({ handleClear }) {
  return (
    <div className={classes.notfound}>
      <img src={NotFound} />
      <h4>По данному запросу ничего не найдено</h4>
      <div className={classes.telContainer}>
        <p>Если у вас появились вопросы, позвоните нам по телефону:</p>
        <a href="#" onClick={(e) => e.preventDefault()}>
          +7 (927) 723-48-35
        </a>
      </div>
      <MyButton className={classes.notfoundBtn} onClick={handleClear}>
        Очистить поиск
      </MyButton>
    </div>
  );
}
