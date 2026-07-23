import LoginInput from "../LoginInput/LoginInput";
import Checkbox from "../Checkbox/Checkbox";
import MySelect from "../../../UI/MySelect/MySelect";

export default function MyField({
  field,
  value,
  handleChange,
  handleBlur,
  options = [],
  selectClassName = "",
  inputClassName = "",
  checkboxClassName = "",
}) {
  const renderField = () => {
    switch (field.type) {
      case "select":
        return (
          <MySelect
            showSearch
            placeholder={field.label}
            optionFilterProp="label"
            onChange={(value) => handleChange(field.name, value)}
            onBlur={(e) => handleBlur(field.name)}
            value={value || null}
            options={options}
            className={selectClassName}
          />
        );

      case "checkbox":
        return (
          <Checkbox
            name={field.name}
            id={field.name}
            className={checkboxClassName}
            checked={value}
            onChange={(e) => handleChange(e.target.name, e.target.checked)}
            onBlur={(e) => handleBlur(e.target.name)}
          />
        );

      default:
        return (
          <LoginInput
            type={field.type}
            placeholder={field.label}
            name={field.name}
            id={field.name}
            autoComplete={field.name}
            value={value || ""}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            onBlur={(e) => handleBlur(e.target.name)}
            className={inputClassName}
          />
        );
    }
  };

  return <>{renderField()}</>;
}
