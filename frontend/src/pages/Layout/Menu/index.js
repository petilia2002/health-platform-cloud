import { RiHome2Line } from "react-icons/ri";
import { ImLab } from "react-icons/im";
import { FiTrendingUp } from "react-icons/fi";
import { BsChatDots } from "react-icons/bs";
import { GrUserManager } from "react-icons/gr";
import { MdOndemandVideo } from "react-icons/md";
import { AiOutlineMedicineBox } from "react-icons/ai";
import { IoStatsChartSharp } from "react-icons/io5";

export const navlinks = [
  {
    name: "Главная",
    path: "/home",
    icon: RiHome2Line,
    roles: ["Пациент", "Врач", "Администратор"],
  },
  {
    name: "Анализы крови",
    path: "/tests",
    icon: ImLab,
    roles: ["Пациент"],
  },
  {
    name: "Мои прогнозы",
    path: "/forecasts",
    icon: FiTrendingUp,
    roles: ["Пациент"],
  },
  {
    name: "Мессенджер",
    path: "/messenger",
    icon: BsChatDots,
    roles: ["Пациент", "Врач"],
  },
  {
    name: "Специалисты",
    path: "/doctors",
    icon: GrUserManager,
    roles: ["Пациент", "Администратор"],
  },
  {
    name: "Заявки пациента",
    path: "/requests",
    icon: MdOndemandVideo,
    roles: ["Пациент"],
  },
  {
    name: "Заявки врача",
    path: "/requests",
    icon: MdOndemandVideo,
    roles: ["Врач"],
  },
  {
    name: "Мои пациенты",
    path: "/patients",
    icon: AiOutlineMedicineBox,
    roles: ["Врач"],
  },
  {
    name: "Статистика",
    path: "/statistics",
    icon: IoStatsChartSharp,
    roles: ["Администратор"],
  },
];
