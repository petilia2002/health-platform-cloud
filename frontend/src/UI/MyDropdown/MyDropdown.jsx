import { Dropdown, ConfigProvider } from "antd";

export default function MyDropdown({
  children,
  menuItems,
  themeStyles,
  setMenuIsOpen,
}) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Dropdown: {
            colorText: "#3f8cf4",
            controlItemBgHover: "#e8f3fe",
            fontSize: 18,
            paddingXXS: 10,
            controlPaddingHorizontal: 15,
            paddingBlock: 5,
            colorSplit: "#bbb",
            ...themeStyles,
          },
        },
      }}
    >
      <Dropdown
        menu={{ items: menuItems }}
        trigger={["click"]}
        placement="bottomRight"
        onOpenChange={(open) => setMenuIsOpen(open)}
      >
        {children}
      </Dropdown>
    </ConfigProvider>
  );
}
