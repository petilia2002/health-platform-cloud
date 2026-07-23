import { useMemo } from "react";

export const useFilter = (filterValues, items, filterFunc) => {
  const filteredItems = useMemo(() => {
    return items.filter(filterFunc);
  }, [...filterValues, items]);
  return filteredItems;
};
