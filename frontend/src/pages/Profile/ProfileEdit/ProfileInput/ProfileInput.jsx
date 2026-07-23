import { Input, DatePicker, Radio, InputNumber, Select } from "antd";
import classes from "./ProfileInput.module.css";

const { TextArea } = Input;

const commonProps = (attr) => ({
  placeholder: attr.placeholder,
  className: classes.formInput,
});

const genderOptions = [
  { label: "Мужчина", value: "male" },
  { label: "Женщина", value: "female" },
];

const bloodOptions = [
  {
    value: "O(I) Rh+",
    label: "первая положительная",
  },
  {
    value: "O(I) Rh−",
    label: "первая отрицательная",
  },
  {
    value: "A(II) Rh+",
    label: "вторая положительная",
  },
  {
    value: "A(II) Rh−",
    label: "вторая отрицательная",
  },
  {
    value: "B(III) Rh+",
    label: "третья положительная",
  },
  {
    value: "B(III) Rh−",
    label: "третья отрицательная",
  },
  {
    value: "AB(IV) Rh+",
    label: "четвёртая положительная",
  },
  {
    value: "AB(IV) Rh−",
    label: "четвёртая отрицательная",
  },
];

const profileInputMap = {
  text: (attr, rest) => <Input {...commonProps(attr)} {...rest} />,
  email: (attr, rest) => <Input {...commonProps(attr)} {...rest} />,
  textarea: (attr, rest) => (
    <TextArea
      {...commonProps(attr)}
      style={{ height: 120, resize: "none" }}
      {...rest}
    />
  ),
  integer: (attr, rest) => (
    <InputNumber
      {...commonProps(attr)}
      suffix={attr.units}
      style={{ width: "100%" }}
      {...rest}
    />
  ),
  number: (attr, rest) => (
    <InputNumber
      {...commonProps(attr)}
      step="0.1"
      precision={1}
      suffix={attr.units}
      style={{ width: "100%" }}
      {...rest}
    />
  ),
  date: (attr, rest) => (
    <DatePicker
      {...commonProps(attr)}
      style={{ width: "100%" }}
      format="DD.MM.YYYY"
      {...rest}
    />
  ),
  radio: (_, rest) => (
    <Radio.Group
      options={genderOptions}
      className={classes.radioInput}
      {...rest}
    />
  ),
  select: (attr, rest) => (
    <Select
      showSearch
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      placeholder={attr.placeholder}
      className={classes.selectInput}
      options={bloodOptions}
      {...rest}
    />
  ),
};

export default function ProfileInput({ attr, ...rest }) {
  const inputRender = profileInputMap[attr.type];
  return inputRender(attr, rest);
}
