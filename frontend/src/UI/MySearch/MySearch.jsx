import { Select, ConfigProvider } from "antd";
import classes from "./MySearch.module.css";

export default function MySearch({
  className,
  themes,
  options,
  value,
  onChange,
  placeholder,
  listHeight,
  notFoundContent,
  useSort = true,
  ...props
}) {
  const filterSort = useSort
    ? (optionA, optionB) =>
        (optionA?.label ?? "")
          .toLowerCase()
          .localeCompare((optionB?.label ?? "").toLowerCase())
    : null;

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            fontSize: 16,
            optionFontSize: 16,
            ...themes,
          },
        },
      }}
    >
      <Select
        showSearch
        className={`${classes.mySearch} ${className}`}
        placeholder={placeholder}
        optionFilterProp="label"
        filterSort={filterSort}
        options={options}
        value={value}
        onChange={onChange}
        listHeight={listHeight}
        notFoundContent={notFoundContent}
        {...props}
      />
    </ConfigProvider>
  );
}
