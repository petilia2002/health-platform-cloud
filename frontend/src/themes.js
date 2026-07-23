export const theme = {
  token: {
    fontFamily: '"Roboto", sans-serif',
    colorText: "#343a40",
    colorPrimary: "#3f8cf4",
    colorLink: "#3f8cf4",
    colorLinkHover: "#1f6ad5",
    borderRadius: 6,
    fontSize: 16,
    lineWidth: 2,
    controlOutline: "rgba(63, 140, 244, 0.3)", // голубая подсветка
    controlOutlineWidth: 2,
  },
  components: {
    Typography: {
      fontFamily: '"Montserrat", sans-serif',
      fontFamilyCode: '"Montserrat", sans-serif',
    },
    Spin: {
      colorPrimary: "#3f8cf4",
      colorText: "#3f8cf4",
    },
    Message: {
      fontFamily: '"Montserrat", sans-serif',
      fontFamilyCode: '"Montserrat", sans-serif',
      contentPadding: 16, // внутренние отступы (px)
      contentBg: "#fff", // цвет фона (по желанию)
      colorText: "#000", // цвет текста
      borderRadiusLG: 8, // скругление
    },
    Select: {
      fontFamily: '"Montserrat", sans-serif',
      colorTextPlaceholder: "#8c8c8c;",
      lineWidth: 2,
      colorPrimary: "#3f8cf4", // синий цвет для активных состояний
      colorText: "#333", // темный цвет текста
      colorTextBase: "#333", // базовый цвет текста
      colorBgContainer: "#ffffff", // белый фон
      colorBorder: "#3f8cf4", // цвет границы
      colorPrimaryHover: "#397ee2", // голубой при наведении
      colorPrimaryActive: "#397ee2", // темно-синий при активации
      controlOutline: "rgba(29, 161, 242, 0.3)", // голубая тень при фокусе
      controlOutlineWidth: 3, // толщина тени при фокусе
      optionSelectedColor: "#ffffff", // белый текст выбранной опции
      optionSelectedBg: "#3f8cf4", // синий фон выбранной опции
      optionActiveBg: "#e6f7ff", // голубой фон при наведении на опцию
    },
    Table: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: 16,
    },
    Button: {
      colorText: "#3f8cf4", // базовый цвет
      colorTextHover: "#3f8cf4", // при hover
      colorBgTextHover: "rgba(63,140,244,0.08)", // фон при hover у variant="text"
      controlOutline: "rgba(63, 140, 244, 0.3)",
    },
    Tooltip: {
      colorBgSpotlight: "#3f8cf4", // фон тултипа
      colorTextLightSolid: "#fff", // цвет текста
    },
    DatePicker: {
      fontSize: 16,
      colorBorder: "#3f8cf4", // цвет границы
      colorPrimaryHover: "#397ee2", // голубой при наведении
      colorPrimaryActive: "#397ee2", // темно-синий при активации
      controlOutline: "rgba(29, 161, 242, 0.3)", // голубая тень при фокусе
      controlOutlineWidth: 3, // толщина тени при фокусе
    },
  },
};
