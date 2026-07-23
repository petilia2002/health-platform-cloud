import { Link } from "react-scroll";
import classes from "./Beginning.module.css";

export default function Beginning() {
  return (
    <section className={classes.cta}>
      <div className={classes.container}>
        <h2>Готовы начать заботиться о своем здоровье?</h2>
        <p>
          Присоединяйтесь к тысячам пользователей, которые уже доверяют «Сервису
          здоровья» свои анализы и получают точные прогнозы.
        </p>
        <Link to="#" className={`${classes.btn} ${classes.btnPrimary}`}>
          Зарегистрироваться сейчас
        </Link>
      </div>
    </section>
  );
}
