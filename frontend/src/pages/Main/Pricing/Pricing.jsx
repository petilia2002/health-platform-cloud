import { Link } from "react-scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import classes from "./Pricing.module.css";

export default function Pricing() {
  return (
    <section id="pricing" className={classes.section}>
      <div className={classes.container}>
        <div className={classes.sectionTitle}>
          <h2>Наши тарифы</h2>
          <p>Выберите подходящий вариант использования платформы</p>
        </div>
        <div className={classes.pricingGrid}>
          <div className={classes.pricingCard}>
            <div className={classes.pricingHeader}>
              <h3>Базовый</h3>
              <div className={classes.price}>
                0<span>₽/месяц</span>
              </div>
            </div>
            <div className={classes.pricingBody}>
              <ul className={classes.pricingFeatures}>
                <li>
                  <FontAwesomeIcon icon={faCheck} /> 5 анализов в месяц
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} /> Прогнозирование рисков
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} /> История анализов
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} /> Расшифровка анализов
                </li>
                <li>
                  <FontAwesomeIcon icon={faTimes} className={classes.close} />{" "}
                  Комментарии врачей
                </li>
              </ul>
              <Link
                to="#"
                className={`${classes.btn} ${classes.btnOutline} ${classes.priceBtn}`}
              >
                Начать бесплатно
              </Link>
            </div>
          </div>
          <div className={classes.pricingCard}>
            <div className={`${classes.pricingHeader} ${classes.selectedCard}`}>
              <h3>Стандарт</h3>
              <div className={classes.price}>
                990<span>₽/месяц</span>
              </div>
            </div>
            <div className={classes.pricingBody}>
              <ul className={classes.pricingFeatures}>
                <li>
                  <FontAwesomeIcon icon={faCheck} /> 20 анализов в месяц
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} /> Прогнозирование рисков
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} /> Расширенная история
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} /> Расшифровка анализов
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} /> 5 комментариев врача
                </li>
              </ul>
              <Link
                to="#"
                className={`${classes.btn} ${classes.btnPrimary} ${classes.priceBtn}`}
              >
                Выбрать тариф
              </Link>
            </div>
          </div>
          <div className={classes.pricingCard}>
            <div className={classes.pricingHeader}>
              <h3>Премиум</h3>
              <div className={classes.price}>
                1990<span>₽/месяц</span>
              </div>
            </div>
            <div className={classes.pricingBody}>
              <ul className={classes.pricingFeatures}>
                <li>
                  <FontAwesomeIcon icon={faCheck} /> Неограниченное число
                  анализов
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} /> Прогнозирование рисков
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} /> Полная история
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} /> Расшифровка анализов
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} /> 20 комментариев врача
                </li>
              </ul>
              <Link
                to="#"
                className={`${classes.btn} ${classes.btnOutline} ${classes.priceBtn}`}
              >
                Выбрать тариф
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
