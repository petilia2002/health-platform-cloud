import React from "react";
import classes from "./RoleButton.module.css";

export default function RoleButton({ option, selectedRole, onSelect }) {
  return (
    <div
      className={
        selectedRole === option.value
          ? `${classes.roleBtn} ${classes.active}`
          : classes.roleBtn
      }
      onClick={() => onSelect(option.value)}
    >
      {option.name}
    </div>
  );
}
