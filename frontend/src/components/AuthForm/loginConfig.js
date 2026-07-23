import { fields } from "./loginFields";
import {
  isEmpty,
  isChecked,
  validLength,
  validEmail,
  isContainSpaces,
} from "../../utils/validation";

export const getInitialLoginData = () => {
  return fields.reduce((acc, field) => {
    acc[field.name] = field.type === "checkbox" ? false : "";
    return acc;
  }, {});
};

export const fieldValidators = {
  email: [validEmail],
  password: [isEmpty, isContainSpaces, validLength(4, 8)],
  remember: [],
};
