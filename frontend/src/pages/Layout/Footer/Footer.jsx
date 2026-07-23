import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
  faVk,
  faTelegram,
  faYoutube,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import classes from "./Footer.module.css";

export default function Footer() {
  return (
    <div className={classes.footer}>
      <p>&copy; 2025 Сервис здоровья. Все права защищены.</p>
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
      <div className={classes.socialLinks}>
        <a
          href="https://vk.com/lantakhabarovsk"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faVk} size={10} />
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
  );
}
