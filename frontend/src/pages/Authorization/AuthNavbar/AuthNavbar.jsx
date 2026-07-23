import { useRef } from "react";
import { Link, useLocation } from "react-router";
import CustomLink from "../../../UI/CustomLink/CustomLink";
import classes from "./AuthNavbar.module.css";

export default function AuthNavbar() {
  const location = useLocation();
  const redirectPathRef = useRef(location.state?.from || "/home");

  return (
    <nav className={classes.navbar}>
      <Link to="/" className={classes.logo}>
        <img src="/logo.png" className={classes.logoImage} />
        <div className={classes.logoText}>
          <span>Сервис</span>
          <span>здоровья</span>
        </div>
      </Link>
      <div className={classes.btnContainer}>
        <CustomLink
          to="/login"
          commonClass={classes.link}
          activeClass={classes.active}
          state={{ from: redirectPathRef.current }}
        >
          Авторизация
        </CustomLink>
        <CustomLink
          to="/registration"
          commonClass={classes.link}
          activeClass={classes.active}
          state={{ from: redirectPathRef.current }}
        >
          Регистрация
        </CustomLink>
      </div>
    </nav>
  );
}
