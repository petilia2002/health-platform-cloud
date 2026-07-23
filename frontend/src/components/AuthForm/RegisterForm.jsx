import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { useDispatch } from "react-redux";
import { registration } from "../../store/authSlice";
import LoginLabel from "./LoginLabel/LoginLabel";
import LoginButton from "./LoginButton/LoginButton";
import Checkbox from "./Checkbox/Checkbox";
import RoleSwitcher from "./RoleSwticher/RoleSwitcher";
import MyField from "./MyField/MyField";
import classes from "./RegisterForm.module.css";
import {
  getInitialFormData,
  fieldValidators,
  formValidators,
} from "./registerConfig";
import { fields } from "./registerFields.jsx";
import { useValidation } from "../../hooks/useValidation";
import { useNotification } from "../../hooks/useNotification";
import { Spin } from "antd";
import { useAuth } from "../../hooks/useAuth";

const roleMapping = {
  patient: "Пациент",
  doctor: "Врач",
  admin: "Администратор",
};

const genderMapping = {
  male: "Мужчина",
  female: "Женщина",
};

export default function RegisterForm() {
  const [role, setRole] = useState("patient");

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || "/home";

  const dispatch = useDispatch();

  const {
    formData,
    errors,
    isDirtyMap,
    isSubmitted,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useValidation(
    fields[role],
    () => getInitialFormData(role),
    fieldValidators,
    formValidators,
    () => {
      registerHandler(formData);
    },
    role,
  );

  const [handleNotification, _, serverError, setServerError] = useNotification({
    successMsg: "Вы успешно зарегистрированы!",
    errorMsg: "Ошибка при регистрации",
  });

  const registerHandler = (formData) => {
    handleNotification(async () => {
      await dispatch(
        registration({
          ...formData,
          role: roleMapping[role],
          gender: genderMapping[formData.gender],
        }),
      ).unwrap();
      navigate(redirectPath, { replace: true });
    });
  };

  const { registration: registrationDetails } = useAuth();

  function handleRoleChange(newRole) {
    if (newRole !== role) {
      setRole(newRole);
      setServerError(null);
    }
  }

  return (
    <form className={classes.registerForm}>
      <div className={classes.linkGroup}>
        <p className={classes.registerText}>Уже есть аккаунт?</p>
        <Link
          to={"/login"}
          className={classes.registerLink}
          state={{ from: redirectPath }}
        >
          Авторизация
        </Link>
      </div>
      <h4 className={classes.formTitle}>Регистрация</h4>
      <RoleSwitcher
        className={classes.registerSwitch}
        options={[
          { value: "patient", name: "Пациент" },
          { value: "doctor", name: "Врач" },
        ]}
        selectedRole={role}
        onSelect={(newRole) => handleRoleChange(newRole)}
      />
      <div className={classes.formGrid}>
        {fields[role]
          .filter((item) => item.type !== "checkbox")
          .map((field) => (
            <div
              key={field.name}
              className={`${classes.formField} ${
                classes[`span_${field.columns}`]
              }`}
            >
              <LoginLabel htmlFor={field.name}>{field.label}</LoginLabel>
              <MyField
                field={field}
                value={formData[field.name]}
                handleChange={handleChange}
                handleBlur={handleBlur}
                options={[
                  {
                    value: "female",
                    label: "Женщина",
                  },
                  {
                    value: "male",
                    label: "Мужчина",
                  },
                ]}
                selectClassName={classes.formSelect}
                checkboxClassName={classes.registerCheckbox}
                inputClassName={
                  field.name.toLowerCase().includes("password")
                    ? `${classes.passwordInput} ${classes.formInput}`
                    : classes.formInput
                }
              />
              <div className={classes.errorContainer}>
                <p className={classes.errorMsg}>
                  {(isDirtyMap[field.name] || isSubmitted) &&
                    errors[field.name]}
                </p>
              </div>
            </div>
          ))}
      </div>
      <div className={classes.politics}>
        {fields[role]
          .filter((item) => item.type === "checkbox")
          .map((field) => (
            <div className={classes.checkContainer} key={field.name}>
              <div className={classes.checkGroup}>
                <Checkbox
                  name={field.name}
                  id={field.name}
                  className={classes.registerCheckbox}
                  checked={formData[field.name]}
                  onChange={(e) =>
                    handleChange(e.target.name, e.target.checked)
                  }
                  onBlur={(e) => handleBlur(e.target.name)}
                />
                <LoginLabel
                  htmlFor={field.name}
                  className={classes.registerLabel}
                >
                  {field.label}
                </LoginLabel>
              </div>
              <div className={classes.errorContainer}>
                <p className={classes.errorMsg}>
                  {(isDirtyMap[field.name] || isSubmitted) &&
                    errors[field.name]}
                </p>
              </div>
            </div>
          ))}
      </div>
      <div className={classes.btnContainer}>
        <LoginButton
          className={classes.registerBtn}
          onClick={handleSubmit}
          disabled={registrationDetails.isLoading}
        >
          Создать аккаунт
        </LoginButton>
        <div className={classes.serverErrorCont}>
          {!registrationDetails.isLoading ? (
            <p className={classes.serverError}>{isSubmitted && serverError}</p>
          ) : (
            <Spin spinning={true} size="small" />
          )}
        </div>
      </div>
    </form>
  );
}
