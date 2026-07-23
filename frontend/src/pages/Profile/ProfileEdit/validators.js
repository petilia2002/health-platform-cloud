export const validatorMap = {
  last_name: (attr) => [
    {
      required: true,
      message: `Поле "${attr.label}" обязательно для заполнения`,
    },
    {
      min: 2,
      message: `Минимальная длина поля "${attr.label}" 2 символа`,
    },
    {
      max: 50,
      message: `Максимальная длина поля "${attr.label}" 50 символов`,
    },
  ],
  first_name: (attr) => [
    {
      required: true,
      message: `Поле "${attr.label}" обязательно для заполнения`,
    },
    {
      min: 2,
      message: `Минимальная длина поля "${attr.label}" 2 символа`,
    },
    {
      max: 50,
      message: `Максимальная длина поля "${attr.label}" 50 символов`,
    },
  ],
  middle_name: (attr) => [
    {
      required: true,
      message: `Поле "${attr.label}" обязательно для заполнения`,
    },
    {
      min: 2,
      message: `Минимальная длина поля "${attr.label}" 2 символа`,
    },
    {
      max: 50,
      message: `Максимальная длина поля "${attr.label}" 50 символов`,
    },
  ],
  birth_date: (attr) => [
    {
      required: true,
      message: `Поле "${attr.label}" обязательно для заполнения`,
    },
  ],
  gender: (attr) => [
    {
      required: true,
      message: `Поле "${attr.label}" обязательно для заполнения`,
    },
  ],
  email: (attr) => [
    {
      required: true,
      message: `Поле "${attr.label}" обязательно для заполнения`,
    },
    { type: "email", message: "Некорректный email" },
    {
      max: 50,
      message: `Максимальная длина поля "${attr.label}" 50 символов`,
    },
  ],
  phone: () => [
    { min: 5, message: "Телефон должен содержать не менее 5 символов" },
    { max: 20, message: "Телефон должен содержать не более 20 символов" },
  ],
  city: (attr) => [
    {
      min: 3,
      message: `Минимальная длина поля "${attr.label}" 3 символа`,
    },
    {
      max: 30,
      message: `Максимальная длина поля "${attr.label}" 30 символов`,
    },
  ],
  place_employment: (attr) => [
    {
      required: true,
      message: `Поле "${attr.label}" обязательно для заполнения`,
    },
    {
      min: 3,
      message: `Минимальная длина поля "${attr.label}" 3 символа`,
    },
    {
      max: 50,
      message: `Максимальная длина поля "${attr.label}" 50 символов`,
    },
  ],
  post: (attr) => [
    {
      required: true,
      message: `Поле "${attr.label}" обязательно для заполнения`,
    },
    {
      min: 3,
      message: `Минимальная длина поля "${attr.label}" 3 символа`,
    },
    {
      max: 40,
      message: `Максимальная длина поля "${attr.label}" 40 символов`,
    },
  ],
  specialization: (attr) => [
    {
      required: true,
      message: `Поле "${attr.label}" обязательно для заполнения`,
    },
    {
      min: 3,
      message: `Минимальная длина поля "${attr.label}" 3 символа`,
    },
    {
      max: 50,
      message: `Максимальная длина поля "${attr.label}" 50 символов`,
    },
  ],
  education: (attr) => [
    {
      min: 8,
      message: `Минимальная длина поля "${attr.label}" 8 символов`,
    },
    {
      max: 500,
      message: `Максимальная длина поля "${attr.label}" 500 символов`,
    },
  ],
  experience: () => [
    { type: "number", min: 0, message: "Стаж не может быть отрицательным" },
    { type: "number", max: 60, message: "Стаж не может превышать 60 лет" },
  ],
  bio: (attr) => [
    {
      min: 5,
      message: `Минимальная длина поля "${attr.label}" 5 символов`,
    },
    {
      max: 500,
      message: `Максимальная длина поля "${attr.label}" 50 символов`,
    },
  ],
  height: () => [
    { type: "number", min: 100, message: "Рост не может быть меньше 100 см" },
    { type: "number", max: 250, message: "Рост не может быть больше 250 см" },
  ],
  weight: () => [
    { type: "number", min: 30, message: "Вес не может быть меньше 30 кг" },
    { type: "number", max: 250, message: "Вес не может быть больше 250 кг" },
  ],
  blood_type: (attr) => [
    {
      required: false,
    },
  ],
};
