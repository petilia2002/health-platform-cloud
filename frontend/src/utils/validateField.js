export const validateField = (inputValue, minValue, maxValue) => {
  if (!inputValue) return Promise.resolve();

  if (!/^-?\d*[,.]?\d+$|^-?\d+[,.]?\d*$/.test(inputValue)) {
    return Promise.reject("Введите корректное число");
  }

  if (inputValue.startsWith(".") || inputValue.startsWith(",")) {
    return Promise.reject("Число не может начинаться с точки или запятой");
  }

  if (inputValue.endsWith(".") || inputValue.endsWith(",")) {
    return Promise.reject("Число не может заканчиваться точкой или запятой");
  }

  const decimalCount = (inputValue.match(/[,.]/g) || []).length;
  if (decimalCount > 1) {
    return Promise.reject("Может быть только один разделитель дробной части");
  }

  const numValue = parseFloat(inputValue.replace(",", "."));

  if (typeof numValue !== "number" || isNaN(numValue)) {
    return Promise.reject("Введите корректное число");
  }
  if (numValue < minValue || numValue > maxValue) {
    return Promise.reject(`Значение должно быть от ${minValue} до ${maxValue}`);
  }
  return Promise.resolve();
};

export const formDataProcess = (formValues) => {
  const processedEntries = Object.entries(formValues)
    .filter(([_, value]) => {
      return value;
    })
    .map(([key, value]) => {
      if (typeof value === "string") {
        const numValue = parseFloat(value.replace(",", "."));
        return [key, isNaN(numValue) ? value : numValue];
      }
      return [key, value];
    });

  return Object.fromEntries(processedEntries);
};
