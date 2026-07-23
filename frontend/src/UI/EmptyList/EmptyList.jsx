import { Empty } from "antd";
import classes from "./EmptyList.module.css";

export default function EmptyList({
  containerClassName = "",
  className = "",
  text = "Не найдено",
}) {
  return (
    <div className={`${containerClassName} ${classes.emptyBox}`}>
      <Empty
        description={
          <p className={`${className} ${classes.emptyText}`}>{text}</p>
        }
        styles={{ image: { height: "200px" } }}
      ></Empty>
    </div>
  );
}
