import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { RiHome2Line } from "react-icons/ri";
import { ImLab } from "react-icons/im";
import { MdOndemandVideo } from "react-icons/md";
import { IoStatsChartSharp } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { FiMenu } from "react-icons/fi";
import CustomLink from "../../../UI/CustomLink/CustomLink";
import classes from "./BottomMenu.module.css";

export const navlinks = [
  {
    name: "Главная",
    path: "/home",
    icon: RiHome2Line,
    roles: ["Пациент", "Врач", "Администратор"],
  },
  {
    name: "Анализы",
    path: "/tests",
    icon: ImLab,
    roles: ["Пациент"],
  },
  {
    name: "Заявки",
    path: "/requests",
    icon: MdOndemandVideo,
    roles: ["Врач"],
  },
  {
    name: "Статистика",
    path: "/statistics",
    icon: IoStatsChartSharp,
    roles: ["Администратор"],
  },
  {
    name: "Профиль",
    path: "/profile/me",
    icon: LuUserRound,
    roles: ["Пациент", "Врач", "Администратор"],
  },
];

export default function BottomMenu({ menuIsActive, toggleMenu, closeMenu }) {
  const { user } = useAuth();
  const routes = navlinks.filter((link) => link.roles.includes(user.role));

  return (
    <div className={classes.menu}>
      {routes.map((route) => {
        const IconComponent = route.icon;
        return (
          <CustomLink
            key={route.path}
            to={route.path}
            commonClass={classes.navLink}
            activeClass={classes.active}
            onClick={() => closeMenu(route.path)}
          >
            {IconComponent && (
              <IconComponent size={22} className={classes.nav_icon} />
            )}
            {route.name}
          </CustomLink>
        );
      })}
      <div
        className={
          menuIsActive
            ? `${classes.toggleMenu} ${classes.activeMenu}`
            : classes.toggleMenu
        }
        onClick={toggleMenu}
      >
        <FiMenu size={25} />
        Меню
      </div>
    </div>
  );
}
