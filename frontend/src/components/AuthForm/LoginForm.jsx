import { Link, useNavigate, useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import LoginInput from "./LoginInput/LoginInput";
import LoginLabel from "./LoginLabel/LoginLabel";
import LoginButton from "./LoginButton/LoginButton";
import Checkbox from "./Checkbox/Checkbox";
import classes from "./LoginForm.module.css";
import { getInitialLoginData, fieldValidators } from "./loginConfig";
import { fields } from "./loginFields";
import { useValidation } from "../../hooks/useValidation";
import { Spin } from "antd";
import { useAuth } from "../../hooks/useAuth";
import { useNotification } from "../../hooks/useNotification";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || "/home";

  const {
    formData,
    errors,
    isDirtyMap,
    isSubmitted,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useValidation(fields, getInitialLoginData, fieldValidators, {}, () => {
    loginHandler(formData);
  });

  const [handleNotification, _, serverError] = useNotification({
    successMsg: "Вы успешно вошли в систему",
    errorMsg: "Ошибка авторизации",
  });

  const loginHandler = () => {
    handleNotification(async () => {
      await dispatch(login(formData)).unwrap();
      navigate(redirectPath, { replace: true });
    });
  };

  const { login: loginDetails } = useAuth();

  return (
    <form className={classes.loginForm}>
      <h4 className={classes.formTitle}>Авторизация</h4>
      {fields
        .filter((item) => item.type !== "checkbox")
        .map((field) => (
          <div className={classes.formGroup} key={field.name}>
            <LoginLabel htmlFor={field.name}>{field.label}</LoginLabel>
            <LoginInput
              type={field.type}
              placeholder={field.placeholder}
              name={field.name}
              id={field.name}
              autoComplete={field.autocomplete}
              className={
                field.type === "password"
                  ? `${classes.formInput} ${classes.passwordInput}`
                  : classes.formInput
              }
              value={formData[field.name]}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              onBlur={(e) => handleBlur(e.target.name)}
            />
            <p className={classes.errorMsg}>
              {(isDirtyMap[field.name] || isSubmitted) && errors[field.name]}
            </p>
          </div>
        ))}
      {fields
        .filter((item) => item.type === "checkbox")
        .map((field) => (
          <div className={classes.formGroup} key={field.name}>
            <div className={classes.checkGroup}>
              <Checkbox
                name={field.name}
                id={field.name}
                checked={formData[field.name]}
                onChange={(e) => handleChange(e.target.name, e.target.checked)}
                onBlur={(e) => handleBlur(e.target.name)}
              />
              <LoginLabel htmlFor={field.name} className={classes.loginLabel}>
                {field.label}
              </LoginLabel>
            </div>
            <p className={classes.errorMsg}>
              {(isDirtyMap[field.name] || isSubmitted) && errors[field.name]}
            </p>
          </div>
        ))}
      <div className={classes.btnContainer}>
        <LoginButton
          className={classes.loginbtn}
          onClick={handleSubmit}
          disabled={loginDetails.isLoading}
        >
          Войти
        </LoginButton>
        <div className={classes.serverErrorCont}>
          {!loginDetails.isLoading ? (
            <p className={classes.serverError}>{isSubmitted && serverError}</p>
          ) : (
            <Spin spinning={true} size="small" />
          )}
        </div>
      </div>
      <div className={classes.linkGroup}>
        <p className={classes.loginText}>Еще нет аккаунта?</p>
        <Link
          to={"/registration"}
          className={classes.loginLink}
          state={{ from: redirectPath }}
        >
          Регистрация
        </Link>
      </div>
    </form>
  );
}
