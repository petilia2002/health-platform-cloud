/* Валидаторы для полей формы */
export const validEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  if (!emailRegex.test(value)) {
    return "Некорректный e-mail";
  }
  return null;
};

export const validLength = (min, max) => {
  return (value) => {
    if (value.length < min || value.length > max) {
      return `Поле должно содержать от ${min} до ${max} символов`;
    }
    return null;
  };
};

export const isEmpty = (value) => {
  if (!value.trim()) {
    return "Поле является обязательным для заполнения";
  }
  return null;
};

export const isChecked = (value) => {
  if (!value) {
    return "Поле является обязательным для выбора";
  }
  return null;
};

export const isContainSpaces = (value) => {
  if (value.includes(" ")) {
    return "Поле не может содержать пробельных символов";
  }
  return null;
};

/* Валидаторы для самой формы */
export const isMatchPasswords = (passwordField, confirmPasswordField) => {
  return (formData) => {
    if (formData[confirmPasswordField] !== formData[passwordField]) {
      return { [confirmPasswordField]: "Пароль не совпадает" };
    }
    return null;
  };
};

/* Метод для проверки корректности ID-параметра из URL-строки */
export const validateId = (id) => {
  return Number.isInteger(Number(id)) && Number(id) > 0;
};
