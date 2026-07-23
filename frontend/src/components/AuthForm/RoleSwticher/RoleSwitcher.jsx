import React from "react";
import RoleButton from "./RoleButton/RoleButton";
import classes from "./RoleSwitcher.module.css";

export default function RoleSwitcher({
  options,
  selectedRole,
  onSelect,
  className = "",
}) {
  return (
    <div className={`${classes.role_switcher} ${className}`} tabIndex={"0"}>
      {options.map((option) => (
        <RoleButton
          key={option.value}
          option={option}
          selectedRole={selectedRole}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
