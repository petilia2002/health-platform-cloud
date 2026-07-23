import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faBrain,
  faUserMd,
  faHistory,
  faBell,
  faChartPie,
} from "@fortawesome/free-solid-svg-icons";
import classes from "./FeatureCards.module.css";

export default function FeatureCards() {
  return (
    <section id="features" className={classes.section}>
      <div className={classes.container}>
        <div className={classes.sectionTitle}>
          <h2>Основные возможности</h2>
          <p>
            Наша платформа предлагает комплексный подход к мониторингу вашего
            здоровья
          </p>
        </div>
        <div className={classes.featuresGrid}>
          <div className={classes.featureCard}>
            <div className={classes.featureIcon}>
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <h3>Анализ показателей</h3>
            <p>
              Автоматический анализ общих и биохимических показателей крови с
              проверкой на соответствие нормам.
            </p>
          </div>
          <div className={classes.featureCard}>
            <div className={classes.featureIcon}>
              <FontAwesomeIcon icon={faBrain} />
            </div>
            <h3>Прогнозирование рисков</h3>
            <p>
              Нейронная сеть оценивает риски развития анемии, диабета, подагры и
              сердечно-сосудистых заболеваний.
            </p>
          </div>
          <div className={classes.featureCard}>
            <div className={classes.featureIcon}>
              <FontAwesomeIcon icon={faUserMd} />
            </div>
            <h3>Консультации врачей</h3>
            <p>
              Возможность получить онлайн-консультацию квалифицированного врача
              по результатам анализов.
            </p>
          </div>
          <div className={classes.featureCard}>
            <div className={classes.featureIcon}>
              <FontAwesomeIcon icon={faHistory} />
            </div>
            <h3>История анализов</h3>
            <p>
              Хранение и удобный просмотр истории всех ваших анализов с
              возможностью фильтрации.
            </p>
          </div>
          <div className={classes.featureCard}>
            <div className={classes.featureIcon}>
              <FontAwesomeIcon icon={faBell} />
            </div>
            <h3>Уведомления</h3>
            <p>
              Своевременные оповещения о новых сообщениях, откликах врачей и
              важных изменениях.
            </p>
          </div>
          <div className={classes.featureCard}>
            <div className={classes.featureIcon}>
              <FontAwesomeIcon icon={faChartPie} />
            </div>
            <h3>Статистика здоровья</h3>
            <p>
              Наглядные таблицы с ключевыми показателями и выделением аномальных
              значений.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
