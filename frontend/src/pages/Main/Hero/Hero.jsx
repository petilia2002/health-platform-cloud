import { Link as ScrollLink } from "react-scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain, faUserMd, faClock } from "@fortawesome/free-solid-svg-icons";
import classes from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={classes.hero}>
      <div className={classes.heroContainer}>
        <h2>Интеллектуальный анализ показателей крови</h2>
        <p>
          Наша платформа использует искусственный интеллект для прогнозирования
          рисков развития заболеваний на основе ваших анализов крови. Получайте
          точные прогнозы и консультируйтесь с врачами онлайн.
        </p>
        <div className={classes.heroBtns}>
          <ScrollLink
            to="#"
            className={`${classes.mainBtn} ${classes.mainBtnPrimary}`}
          >
            Начать бесплатно
          </ScrollLink>
          <ScrollLink
            to="#"
            className={`${classes.mainBtn} ${classes.mainBtnOutline}`}
          >
            Узнать больше
          </ScrollLink>
        </div>
        <div className={classes.heroFeatures}>
          <div className={classes.heroItem}>
            <div className={classes.itemContainer}>
              <div className={classes.heroIcon}>
                <FontAwesomeIcon icon={faBrain} />
              </div>
              <div className={classes.featureText}>
                AI-анализ различных заболеваний
              </div>
            </div>
          </div>
          <div className={classes.heroItem}>
            <div className={classes.itemContainer}>
              <div className={classes.heroIcon}>
                <FontAwesomeIcon icon={faUserMd} />
              </div>
              <div className={classes.featureText}>
                Специалисты высшей категории
              </div>
            </div>
          </div>
          <div className={classes.heroItem}>
            <div className={classes.itemContainer}>
              <div className={classes.heroIcon}>
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div className={classes.featureText}>
                Быстрое получение прогнозов
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
