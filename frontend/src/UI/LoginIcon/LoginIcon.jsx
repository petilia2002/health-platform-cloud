import { IoLogInOutline } from "react-icons/io5";
import classes from "./LoginIcon.module.css";

export default function LoginIcon({ className }) {
  return (
    <div className={`${classes.login} ${className}`}>
      <span className={classes.login_text}>Войти</span>
      <IoLogInOutline className={classes.login_icon} size={30} />
    </div>
  );
}
