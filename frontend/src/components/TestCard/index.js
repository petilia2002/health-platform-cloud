// Функция для группировки показателей и назначения цветов
export const getCategoryColor = (substance) => {
  const colorGroups = {
    // Синие оттенки
    ОАК: "blue",
    СРБ: "blue",

    // Зеленые оттенки
    БИОХИМИЯ: "green",
    ГЛЮКОЗА: "green",
    БЕЛКИ: "green",

    // Оранжевые оттенки
    ВИТАМИНЫ: "orange",
    "ФУНКЦИИ ПОЧЕК": "orange",
    БЕЛКИ: "orange",

    // Фиолетовые оттенки
    ФЕРМЕНТЫ: "purple",
    АЛТ: "purple",
    АСТ: "purple",

    // Желтые оттенки
    ЛИПИДЫ: "yellow",
    "ОБМЕН ЖЕЛЕЗА": "yellow",
    ПИГМЕНТЫ: "yellow",
  };

  return colorGroups[substance] || "blue";
};

// Классификация показателей по категориям
export const METRIC_CATEGORIES = {
  // Всегда присутствуют
  ОАК: [
    "hgb",
    "rbc",
    "mcv",
    "wbc",
    "plt",
    "neut",
    "lymph",
    "eo",
    "baso",
    "mono",
    "mid",
    "gra",
  ],
  БИОХИМИЯ: [
    "ast",
    "alt",
    "ldg",
    "chol",
    "glu",
    "pro",
    "alb",
    "bil_direct",
    "bil_indirect",
    "bil_total",
    "crea",
    "urea",
    "uric",
    "ferritin",
    "crp",
    "b12",
    "folic",
  ],

  // Остальные категории (будут вычисляться)
  ВИТАМИНЫ: ["b12", "folic"],
  ФЕРМЕНТЫ: ["ast", "alt", "ldg"],
  ЛИПИДЫ: ["chol"],
  ГЛЮКОЗА: ["glu"],
  БЕЛКИ: ["pro", "alb"],
  БИЛИРУБИН: ["bil_direct", "bil_indirect", "bil_total"],
  ПОЧКИ: ["crea", "urea", "uric"],
  "ОБМЕН ЖЕЛЕЗА": ["ferritin"],
  ВОСПАЛЕНИЕ: ["crp"],
};

// Базовые теги, которые всегда есть
export const BASE_TAGS = [
  { id: 1, name: "ОАК" },
  { id: 2, name: "БИОХИМИЯ" },
];

// Дополнительные теги в порядке приоритета
export const ADDITIONAL_TAGS = [
  { id: 3, name: "ВИТАМИНЫ" },
  { id: 4, name: "ФЕРМЕНТЫ" },
  { id: 5, name: "ЛИПИДЫ" },
  { id: 6, name: "ГЛЮКОЗА" },
  { id: 7, name: "БЕЛКИ" },
  { id: 8, name: "БИЛИРУБИН" },
  { id: 9, name: "ПОЧКИ" },
  { id: 10, name: "ОБМЕН ЖЕЛЕЗА" },
  { id: 11, name: "ВОСПАЛЕНИЕ" },
];

export const getAnalysisTags = (availableMetrics) => {
  // Всегда добавляем базовые теги
  const tags = [...BASE_TAGS];

  // Проверяем дополнительные теги
  ADDITIONAL_TAGS.forEach((tag) => {
    const categoryMetrics = METRIC_CATEGORIES[tag.name];

    // Проверяем, есть ли хотя бы один показатель из этой категории
    const hasCategory = categoryMetrics.some((metric) =>
      availableMetrics.includes(metric)
    );

    if (hasCategory) {
      tags.push(tag);
    }
  });

  // Ограничиваем максимум 5 тегами (первые 2 базовых + 3 дополнительных)
  return tags.slice(0, 5);
};
