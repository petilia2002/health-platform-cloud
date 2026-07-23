export const fields = {
  patient: [
    {
      name: "last_name",
      label: "Фамилия",
      type: "text",
      placeholder: "Фамилия",
      autocomplete: "family-name",
      columns: 2,
    },
    {
      name: "first_name",
      label: "Имя",
      type: "text",
      placeholder: "Имя",
      autocomplete: "given-name",
      columns: 2,
    },
    {
      name: "middle_name",
      label: "Отчество",
      type: "text",
      placeholder: "Отчество",
      autocomplete: "additional-name",
      columns: 2,
    },
    {
      name: "gender",
      label: "Пол",
      type: "select",
      placeholder: "Укажите ваш пол",
      autocomplete: "gender",
      columns: 2,
    },
    {
      name: "birth_date",
      label: "Дата рождения",
      type: "date",
      placeholder: "Дата рождения",
      autocomplete: "bdate",
      columns: 2,
    },
    {
      name: "email",
      label: "Почта",
      type: "email",
      placeholder: "Почта",
      autocomplete: "email",
      columns: 2,
    },
    {
      name: "password",
      label: "Пароль",
      type: "password",
      placeholder: "Пароль",
      autocomplete: "new-password",
      columns: 3,
    },
    {
      name: "confirm_password",
      label: "Подтвердите пароль",
      type: "password",
      placeholder: "Подтвердите пароль",
      autocomplete: "new-password",
      columns: 3,
    },
    {
      name: "conditions",
      label: (
        <>
          Согласен с{" "}
          <a href="https://lanta27.ru/include/policy.pdf" target="_blank">
            условиями использования платформы
          </a>
        </>
      ),
      type: "checkbox",
      placeholder: false,
      autocomplete: "off",
      columns: null,
    },
    {
      name: "politics",
      label: (
        <>
          Согласен с{" "}
          <a href="https://lanta27.ru/include/policy_pd.pdf" target="_blank">
            политикой в отношении персональных данных
          </a>
        </>
      ),
      type: "checkbox",
      placeholder: false,
      autocomplete: "off",
      columns: null,
    },
    {
      name: "remember",
      label: "Сохранить данные для быстрого входа",
      type: "checkbox",
      placeholder: false,
      autocomplete: "off",
      columns: null,
    },
  ],
  doctor: [
    {
      name: "last_name",
      label: "Фамилия",
      type: "text",
      placeholder: "Фамилия",
      autocomplete: "family-name",
      columns: 2,
    },
    {
      name: "first_name",
      label: "Имя",
      type: "text",
      placeholder: "Имя",
      autocomplete: "given-name",
      columns: 2,
    },
    {
      name: "middle_name",
      label: "Отчество",
      type: "text",
      placeholder: "Отчество",
      autocomplete: "additional-name",
      columns: 2,
    },
    {
      name: "gender",
      label: "Пол",
      type: "select",
      placeholder: "Укажите ваш пол",
      autocomplete: "gender",
      columns: 3,
    },
    {
      name: "birth_date",
      label: "Дата рождения",
      type: "date",
      placeholder: "Дата рождения",
      autocomplete: "bdate",
      columns: 3,
    },
    {
      name: "place_employment",
      label: "Место работы",
      type: "text",
      placeholder: "Место работы",
      autocomplete: "organization",
      columns: 2,
    },
    {
      name: "post",
      label: "Должность",
      type: "text",
      placeholder: "Должность",
      autocomplete: "off",
      columns: 2,
    },
    {
      name: "specialization",
      label: "Специализация",
      type: "text",
      placeholder: "Специализация",
      autocomplete: "off",
      columns: 2,
    },
    {
      name: "email",
      label: "Почта",
      type: "email",
      placeholder: "Почта",
      autocomplete: "email",
      columns: 3,
    },
    {
      name: "password",
      label: "Пароль",
      type: "password",
      placeholder: "Пароль",
      autocomplete: "new-password",
      columns: 3,
    },
    {
      name: "confirm_password",
      label: "Подтвердите пароль",
      type: "password",
      placeholder: "Подтвердите пароль",
      autocomplete: "new-password",
      columns: 3,
    },
    {
      name: "conditions",
      label: (
        <>
          Согласен с{" "}
          <a href="https://lanta27.ru/include/policy.pdf" target="_blank">
            условиями использования платформы
          </a>
        </>
      ),
      type: "checkbox",
      placeholder: false,
      autocomplete: "off",
      columns: null,
    },
    {
      name: "politics",
      label: (
        <>
          Согласен с{" "}
          <a href="https://lanta27.ru/include/policy_pd.pdf" target="_blank">
            политикой в отношении персональных данных
          </a>
        </>
      ),
      type: "checkbox",
      placeholder: false,
      autocomplete: "off",
      columns: null,
    },
    {
      name: "remember",
      label: "Сохранить данные для быстрого входа",
      type: "checkbox",
      placeholder: false,
      autocomplete: "off",
      columns: null,
    },
  ],
};
