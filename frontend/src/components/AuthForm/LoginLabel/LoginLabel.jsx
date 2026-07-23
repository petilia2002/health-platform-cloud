import React from "react";
import classes from "./LoginLabel.module.css";

export default function LoginLabel({ className = "", children, ...props }) {
  return (
    <label className={`${classes.loginLabel} ${className}`} {...props}>
      {children}
    </label>
  );
}
