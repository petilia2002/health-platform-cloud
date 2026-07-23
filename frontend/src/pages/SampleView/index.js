export const isResultNormal = (value, reference) => {
  if (reference.includes("–")) {
    const [min, max] = reference.split(" – ").map(Number);
    return value >= min && value <= max;
  }
  const refNum = Number(reference.split(" ")[1]);
  if (reference.includes("<")) {
    return value <= refNum;
  } else {
    return value >= refNum;
  }
};

// Обязательные показатели ОАК
export const requiredMetrics = [
  {
    key: "hgb",
    label: "Гемоглобин (HGB)",
    units: "г/л",
    min: 11.0,
    max: 215.0,
  },
  {
    key: "rbc",
    label: "Эритроциты (RBC)",
    units: "10¹²/л",
    min: 0.24,
    max: 8.21,
  },
  {
    key: "wbc",
    label: "Лейкоциты (WBC)",
    units: "10⁹/л",
    min: 0.1,
    max: 68.7,
  },
  {
    key: "plt",
    label: "Тромбоциты (PLT)",
    units: "10⁹/л",
    min: 1.0,
    max: 1053.0,
  },
  {
    key: "neut",
    label: "Нейтрофилы (NEUT)",
    units: "%",
    min: 2.9,
    max: 100.0,
  },
  {
    key: "lymph",
    label: "Лимфоциты (LYMPH)",
    units: "%",
    min: 0.1,
    max: 90.7,
  },
  { key: "mono", label: "Моноциты (MONO)", units: "%", min: 0.1, max: 55.4 },
  { key: "eo", label: "Эозинофилы (EO)", units: "%", min: 0.09, max: 43.8 },
  { key: "baso", label: "Базофилы (BASO)", units: "%", min: 0.02, max: 27.2 },
  { key: "mcv", label: "MCV", units: "фл", min: 0.7, max: 134.0 },
];

// Дополнительные показатели биохимии
export const additionalMetrics = [
  { key: "ast", label: "АСТ", units: "Ед/л", min: 0.3, max: 1518.5 },
  { key: "alt", label: "АЛТ", units: "Ед/л", min: 0.1, max: 1721.4 },
  {
    key: "bil_total",
    label: "Билирубин общий",
    units: "мкмоль/л",
    min: 0.03,
    max: 432.43,
  },
  {
    key: "bil_direct",
    label: "Билирубин прямой",
    units: "мкмоль/л",
    min: 0.04,
    max: 238.4,
  },
  {
    key: "bil_indirect",
    label: "Билирубин непрямой",
    units: "мкмоль/л",
    min: 0.05,
    max: 220.79,
  },
  { key: "crea", label: "Креатинин", units: "мкмоль/л", min: 0.3, max: 1618.8 },
  { key: "urea", label: "Мочевина", units: "ммоль/л", min: 0.5, max: 67.5 },
  { key: "glu", label: "Глюкоза", units: "ммоль/л", min: 0.01, max: 26.77 },
  { key: "chol", label: "Холестерин", units: "ммоль/л", min: 0.02, max: 17.2 },
  { key: "pro", label: "Общий белок", units: "г/л", min: 19.2, max: 132.1 },
  { key: "alb", label: "Альбумин", units: "г/л", min: 0.04, max: 60.14 },
  { key: "ldg", label: "ЛДГ", units: "Ед/л", min: 2.0, max: 4983.0 },
  {
    key: "uric",
    label: "Мочевая кислота",
    units: "ммоль/л",
    min: 0.0,
    max: 1.22,
  },
  {
    key: "ferritin",
    label: "Ферритин",
    units: "мкг/л",
    min: 0.01,
    max: 1667.2,
  },
  { key: "b12", label: "Витамин B12", units: "пг/мл", min: 1.0, max: 39833.0 },
  {
    key: "folic",
    label: "Фолиевая кислота",
    units: "нг/мл",
    min: 0.56,
    max: 330.11,
  },
  { key: "crp", label: "СРБ", units: "мг/л", min: 0.01, max: 250.95 },
];
