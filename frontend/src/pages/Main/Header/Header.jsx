import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Link as ScrollLink } from "react-scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import LoginIcon from "../../../UI/LoginIcon/LoginIcon";
import classes from "./Header.module.css";

const sections = [
  { name: "Возможности", path: "features" },
  { name: "Как это работает", path: "how-it-works" },
  { name: "Отзывы", path: "testimonials" },
  { name: "Тарифы", path: "pricing" },
  { name: "Контакты", path: "contact" },
];

export default function Header() {
  const [headerIsScrolled, setHeaderIsScrolled] = useState(false);
  const [menuIsActive, setMenuIsActive] = useState(false);

  const cls = headerIsScrolled
    ? `${classes.header} ${classes.headerScrolled}`
    : `${classes.header}`;

  useEffect(() => {
    const handleScroll = () => {
      setHeaderIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuIsActive(!menuIsActive);
  };

  const closeMenu = () => {
    setMenuIsActive(false);
  };

  return (
    <header id="header" className={cls}>
      <div className={classes.container}>
        <nav className={classes.navbar}>
          <ScrollLink to="#" className={classes.logo}>
            <img src="/logo.png" className={classes.logoImage} />
            <div className={classes.logoText}>
              <span>Сервис</span>
              <span>здоровья</span>
            </div>
          </ScrollLink>
          <div
            className={`${classes.linkContainer} ${
              menuIsActive ? classes.active : ""
            }`}
          >
            <ul className={classes.navLinks}>
              {sections.map((section) => (
                <li key={section.path}>
                  <ScrollLink
                    to={section.path}
                    smooth={true}
                    duration={500}
                    offset={-80}
                    onClick={closeMenu}
                  >
                    {section.name}
                  </ScrollLink>
                </li>
              ))}
            </ul>
            <Link to="/home">
              <LoginIcon />
            </Link>
          </div>
          <button className={classes.mobileMenuBtn} onClick={toggleMenu}>
            {menuIsActive ? (
              <FontAwesomeIcon icon={faTimes} />
            ) : (
              <FontAwesomeIcon icon={faBars} />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
