export const formAttributes = {
  shared: [
    {
      label: "Фамилия",
      name: "last_name",
      type: "text",
      placeholder: "Фамилия",
    },
    {
      label: "Имя",
      name: "first_name",
      type: "text",
      placeholder: "Имя",
    },
    {
      label: "Отчество",
      name: "middle_name",
      type: "text",
      placeholder: "Отчество",
    },
    {
      label: "Дата рождения",
      name: "birth_date",
      type: "date",
      placeholder: "Дата рождения",
    },
    {
      label: "Пол",
      name: "gender",
      type: "radio",
      placeholder: null,
    },
    {
      label: "Почта",
      name: "email",
      type: "email",
      placeholder: "Почта",
    },
    {
      label: "Телефон",
      name: "phone",
      type: "text",
      placeholder: "Телефон",
    },
    {
      label: "Город",
      name: "city",
      type: "text",
      placeholder: "Город",
    },
  ],
  patient: [
    {
      label: "Рост",
      name: "height",
      type: "number",
      placeholder: "Рост",
      units: "см",
    },
    {
      label: "Вес",
      name: "weight",
      type: "number",
      placeholder: "Вес",
      units: "кг",
    },
    {
      label: "Группа крови",
      name: "blood_type",
      type: "select",
      placeholder: "Группа крови",
    },
  ],
  doctor: [
    {
      label: "Место работы",
      name: "place_employment",
      type: "text",
      placeholder: "Место работы",
    },
    {
      label: "Должность",
      name: "post",
      type: "text",
      placeholder: "Должность",
    },
    {
      label: "Специализация",
      name: "specialization",
      type: "text",
      placeholder: "Специализация",
    },
    {
      label: "Стаж",
      name: "experience",
      type: "integer",
      placeholder: "Стаж",
      units: "лет",
    },
    {
      label: "Образование",
      name: "education",
      type: "textarea",
      placeholder: "Образование",
    },
    {
      label: "О себе",
      name: "bio",
      type: "textarea",
      placeholder: "Направления деятельности",
    },
  ],
  admin: [],
};
