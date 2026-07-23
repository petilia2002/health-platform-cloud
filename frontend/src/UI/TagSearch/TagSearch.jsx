import { useState } from "react";
import { Select } from "antd";
import classes from "./TagSearch.module.css";

const options = [];
for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}

export default function TagSearch() {
  const [value, setValue] = useState(null);

  const handleChange = (value) => {
    setValue(value);
    console.log(value);
  };

  return (
    <Select
      mode="tags"
      style={{ width: "100%" }}
      placeholder="Направления деятельности"
      value={value}
      onChange={handleChange}
      options={options}
    />
  );
}
