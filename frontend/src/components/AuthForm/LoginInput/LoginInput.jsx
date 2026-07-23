import React from "react";
import classes from "./LoginInput.module.css";

export default function LoginInput({ className = "", ...props }) {
  return <input className={`${classes.loginInput} ${className}`} {...props} />;
}
