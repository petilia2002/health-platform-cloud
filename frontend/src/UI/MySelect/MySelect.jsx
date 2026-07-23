import { Select } from "antd";
import classes from "./MySelect.module.css";

export default function MySelect({ className = "", ...props }) {
  return <Select className={`${classes.mySelect} ${className}`} {...props} />;
}
