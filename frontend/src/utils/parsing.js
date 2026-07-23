export const parseDate = (dateString) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "дд:мм:гггг";
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

export const parseTime = (dateString) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "чч:мм";
  }

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const parseId = (id) => {
  if (!id) {
    return "#000000";
  }
  return "#" + id.toString().padStart(6, "0");
};

export const handleAnalyteName = (analyte) =>
  analyte
    .split(" ")
    .filter((item) => !item.includes("(") && !item.includes(")"))
    .join(" ");

export const formatDecimal = (value, unit) => {
  if (value === null || value === undefined || isNaN(parseFloat(value))) {
    return "–";
  }
  const rounded = parseFloat(value).toFixed(1); // "123.4"
  const formattedNumber = rounded.replace(".", ","); // "123,4"

  if (typeof unit === "string" && unit.trim() !== "") {
    return `${formattedNumber} ${unit.trim()}`;
  }

  return formattedNumber;
};
