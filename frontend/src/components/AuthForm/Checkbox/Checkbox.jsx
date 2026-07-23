import React from "react";
import classes from "./Checkbox.module.css";

export default function Checkbox({ className, ...props }) {
  return (
    <input
      className={`${classes.loginCheckbox} ${className}`}
      type="checkbox"
      {...props}
    />
  );
}
