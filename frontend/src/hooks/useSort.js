import { useMemo } from "react";

export const useSort = (items, sort) => {
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      let valueA = a[sort.field];
      let valueB = b[sort.field];

      if (sort.field.includes("date")) {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();

        if (sort.order === "asc") {
          return valueA - valueB;
        } else {
          return valueB - valueA;
        }
      }

      if (sort.order === "asc") {
        return valueA.localeComplare(valueB);
      } else {
        return valueB.localeComplare(valueA);
      }
    });
  }, [items, sort]);

  return sortedItems;
};
