import { useState, useEffect } from "react";
import { Input } from "antd";
import classes from "./SearchInput.module.css";

const { Search } = Input;

export default function SearchInput({
  searchValue,
  setSearchParams,
  placeholder = "Введите запрос для поиска",
  className = "",
}) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(searchValue);
  }, [searchValue]);

  const onSearch = (value) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value) {
        newParams.set("query", value);
      } else {
        newParams.delete("query");
      }
      return newParams;
    });
  };

  return (
    <Search
      placeholder={placeholder}
      size="large"
      allowClear
      enterButton
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onSearch={onSearch}
      className={`${className} ${classes.search}`}
    />
  );
}
