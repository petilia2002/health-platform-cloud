import { Link } from "react-scroll";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVk,
  faTelegram,
  faYoutube,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import classes from "./Footer.module.css";

export default function Footer() {
  return (
    <footer id="contact" className={classes.mainFooter}>
      <div className={classes.container}>
        <div className={classes.footerGrid}>
          <div className={classes.footerCol}>
            <h3>Сервис здоровья</h3>
            <p>
              Интеллектуальная платформа для анализа показателей крови и
              прогнозирования патологий.
            </p>
            <div className={classes.socialLinks}>
              <a
                href="https://vk.com/lantakhabarovsk"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faVk} />
              </a>
              <a
                href="https://t.me/lanta_health"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faTelegram} />
              </a>
              <a
                href="https://www.youtube.com/@lantabudzdorov"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <a
                href="https://wa.me/79098700102?text=Здравствуйте.%20Пишу%20с%20сайта."
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
            </div>
          </div>
          <div className={classes.footerCol}>
            <h3>Разделы</h3>
            <ul className={classes.footerLinks}>
              <li>
                <Link to="features" smooth={true} duration={500} offset={-80}>
                  Возможности
                </Link>
              </li>
              <li>
                <Link
                  to="how-it-works"
                  smooth={true}
                  duration={500}
                  offset={-80}
                >
                  Как это работает
                </Link>
              </li>
              <li>
                <Link
                  to="testimonials"
                  smooth={true}
                  duration={500}
                  offset={-80}
                >
                  Отзывы
                </Link>
              </li>
              <li>
                <Link to="pricing" smooth={true} duration={500} offset={-80}>
                  Тарифы
                </Link>
              </li>
            </ul>
          </div>
          <div className={classes.footerCol}>
            <h3>Поддержка</h3>
            <ul className={classes.footerLinks}>
              <li>
                <Link to="#">Центр помощи</Link>
              </li>
              <li>
                <Link to="#">FAQ</Link>
              </li>
              <li>
                <Link to="#">Политика конфиденциальности</Link>
              </li>
              <li>
                <Link to="#">Условия использования</Link>
              </li>
            </ul>
          </div>
          <div className={classes.footerCol}>
            <h3>Контакты</h3>
            <ul className={classes.footerLinks}>
              <li>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Самара, Россия
              </li>
              <li>
                <FontAwesomeIcon icon={faPhone} /> +7 (927) 723-48-35
              </li>
              <li>
                <FontAwesomeIcon icon={faEnvelope} /> zabota@rulis.ru
              </li>
            </ul>
          </div>
        </div>
        <div className={classes.footerBottom}>
          <p>&copy; 2025 Сервис здоровья. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
