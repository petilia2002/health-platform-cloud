import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain, faUserMd, faClock } from "@fortawesome/free-solid-svg-icons";
import classes from "./HeroCards.module.css";

export default function HeroCards() {
  return (
    <div className={classes.heroFeatures}>
      <div className={classes.sectionTitle}>
        <h2>Интеллектуальный анализ показателей крови</h2>
        <p>Получайте точные прогнозы и консультируйтесь с врачами онлайн</p>
      </div>
      <div className={classes.heroContainer}>
        <div className={classes.heroItem}>
          <img src="/top-view-equipment-desk.jpg"></img>
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
          <img src="/medical-banner-with-doctor-wearing-coat.jpg"></img>
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
          <img src="/medical-banner-with-doctor-working-laptop.jpg"></img>
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
  );
}
