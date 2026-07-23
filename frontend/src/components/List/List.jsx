import { Empty } from "antd";
import classes from "./List.module.css";

export default function List({
  className,
  items,
  renderItem,
  renderEmptyList = () => <Empty />,
}) {
  if (!items.length) {
    return renderEmptyList();
  }

  return (
    <div className={`${classes.list} ${className}`}>
      {items.map((item, index) => renderItem(item, index))}
    </div>
  );
}
