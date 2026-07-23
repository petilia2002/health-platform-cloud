import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/authSlice";
import { Link, useNavigate } from "react-router";
import { LuUserRound } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import { LuCircleUserRound } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import { Space } from "antd";
import MyDropdown from "../../../UI/MyDropdown/MyDropdown";
import { useNotification } from "../../../hooks/useNotification";
import classes from "./Navbar.module.css";
import { useAuth } from "../../../hooks/useAuth";

const themeStyles = {
  colorText: "#3f8cf4",
};

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useAuth();

  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [handleNotification] = useNotification("Вы успешно вышли из системы");

  const handleLogout = () => {
    handleNotification(async () => {
      await dispatch(logout()).unwrap();
      navigate("/", { replace: true });
    }, "/");
  };

  const menuItems = [
    {
      key: "1",
      label: "Мой аккаунт",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: <Link to="/profile/me">Личные данные</Link>,
      icon: <LuUserRound size={20} />,
    },
    {
      key: "3",
      label: "Выход",
      icon: <MdLogout size={20} />,
      onClick: handleLogout,
    },
  ];

  return (
    <nav className={classes.navbar}>
      <div className={classes.navContent}>
        <Link to="/" className={classes.logo}>
          <img src="/logo.png" className={classes.logoImage} />
          <div className={classes.logoText}>
            <span>Сервис</span>
            <span>здоровья</span>
          </div>
        </Link>
        <MyDropdown
          menuItems={menuItems}
          themeStyles={themeStyles}
          setMenuIsOpen={setMenuIsOpen}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <div
                className={classes.dropBtn}
                onClick={() => setMenuIsOpen(!menuIsOpen)}
              >
                <span className={classes.userName}>
                  {user.last_name} {user.first_name[0]}. {user.middle_name[0]}.
                </span>
                <LuCircleUserRound size={24} />
                <IoIosArrowDown
                  size={24}
                  className={`${classes.dropArrow} ${
                    menuIsOpen ? classes.active : ""
                  }`}
                />
              </div>
            </Space>
          </a>
        </MyDropdown>
      </div>
    </nav>
  );
}
