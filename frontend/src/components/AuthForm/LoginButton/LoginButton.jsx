import React from "react";
import classes from "./LoginButton.module.css";

export default function LoginButton({ className, children, ...props }) {
  return (
    <button className={`${classes.loginButton} ${className}`} {...props}>
      {children}
    </button>
  );
}
