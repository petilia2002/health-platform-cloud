import { fields } from "./registerFields.jsx";
import {
  isEmpty,
  isChecked,
  validLength,
  validEmail,
  isContainSpaces,
  isMatchPasswords,
} from "../../utils/validation";

export const getInitialFormData = (role) => {
  return fields[role].reduce((acc, field) => {
    acc[field.name] = field.type === "checkbox" ? false : "";
    return acc;
  }, {});
};

export const formValidators = {
  passwordsMatch: isMatchPasswords("password", "confirm_password"),
};

export const fieldValidators = {
  last_name: [isEmpty, validLength(2, 24)],
  first_name: [isEmpty, validLength(2, 24)],
  middle_name: [isEmpty, validLength(2, 24)],
  birth_date: [isEmpty],
  email: [validEmail],
  password: [isEmpty, isContainSpaces, validLength(4, 8)],
  place_employment: [isEmpty, validLength(4, 50)],
  post: [isEmpty, validLength(4, 50)],
  specialization: [isEmpty, validLength(4, 50)],
  confirm_password: [isEmpty, isContainSpaces, validLength(4, 8)],
  politics: [isChecked],
  conditions: [isChecked],
  remember: [],
  gender: [isEmpty],
};
