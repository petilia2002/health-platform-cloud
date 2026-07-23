export const convertUTCToLocal = (utcString) => {
  // Проверяем, не пустая ли строка
  if (!utcString) return utcString;

  // Нормализуем: добавляем 'Z', если его нет, чтобы явно указать UTC
  const normalized = utcString.endsWith("Z") ? utcString : utcString + "Z";
  const date = new Date(normalized);

  // Если дата некорректна, возвращаем исходную строку
  if (isNaN(date.getTime())) return utcString;

  // Вспомогательная функция для форматирования чисел с ведущим нулём
  const pad = (num) => String(num).padStart(2, "0");

  // Получаем локальные компоненты даты/времени
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  // Извлекаем исходную дробную часть (миллисекунды или микросекунды)
  const msMatch = utcString.match(/\.(\d+)/);
  const fraction = msMatch ? "." + msMatch[1] : "";

  // Собираем строку в локальном времени
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${fraction}`;
};

export const getExactDateAgo = (period) => {
  const now = new Date();
  const result = new Date(now);

  if (period === "week") {
    result.setDate(now.getDate() - 7);
  } else if (period === "month") {
    // Корректное вычитание месяца
    result.setMonth(now.getMonth() - 1);
    // Если день месяца стал invalid (например, 31 февраля)
    if (result.getMonth() !== (now.getMonth() - 1 + 12) % 12) {
      result.setDate(0); // последний день предыдущего месяца
    }
  } else if (period === "year") {
    result.setFullYear(now.getFullYear() - 1);
    // Корректировка для 29 февраля
    if (now.getMonth() === 1 && now.getDate() === 29) {
      result.setDate(28);
    }
  }

  return result;
};

export const toLocalISOString = (date) => {
  const pad = (n, size = 2) => String(n).padStart(size, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  return `${year}-${month}-${day}`;
};

export const calculateAge = (birthDateString) => {
  // Проверяем, что дата непустая
  if (!birthDateString) {
    return 0;
  }

  // Разбиваем строку на год, месяц и день
  const [birthYear, birthMonth, birthDay] = birthDateString
    .split("-")
    .map(Number);

  // Получаем текущую дату
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // Месяцы в JS от 0 до 11
  const currentDay = today.getDate();

  // Вычисляем базовый возраст (разница в годах)
  let age = currentYear - birthYear;

  // Проверяем, был ли уже день рождения в текущем году
  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    age--;
  }

  return age;
};

// utils/formatDate.js
export const formatDateTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Проверка на валидность даты
  if (isNaN(date.getTime())) return "";

  const time = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const day = date.getDate();
  const month = getMonthInGenitiveCase(date.getMonth());
  const year = date.getFullYear();

  return `${day} ${month}, ${year} года в ${time}`;
};

// Функция для получения месяцев в родительном падеже
const getMonthInGenitiveCase = (monthIndex) => {
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];
  return months[monthIndex];
};
