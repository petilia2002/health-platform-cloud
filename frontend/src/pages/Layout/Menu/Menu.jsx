import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { LuUserRound } from "react-icons/lu";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { logout } from "../../../store/authSlice";
import userSvg from "../../../assets/user.svg";
import CustomLink from "../../../UI/CustomLink/CustomLink";
import { useNotification } from "../../../hooks/useNotification";
import { useAuth } from "../../../hooks/useAuth";
import { navlinks } from "./index";
import UploadPhoto from "../../../components/UploadPhoto/UploadPhoto";
import classes from "./Menu.module.css";

export default function Menu({ closeMenu }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const routes = useMemo(() => {
    return navlinks.filter((link) => link.roles.includes(user.role));
  }, []);

  const [handleNotification] = useNotification("Вы успешно вышли из системы");

  const exitHandler = (e) => {
    e.preventDefault();
    handleNotification(async () => {
      await dispatch(logout()).unwrap();
      navigate("/", { replace: true });
    }, "/");
  };

  return (
    <div className={classes.menu}>
      <UploadPhoto isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <div className={classes.user_avatar}>
        <a
          href={
            user?.photo_url || "https://new-er.mz63.ru/img/user-photo/def.svg"
          }
          target="_blank"
        >
          <img
            src={user?.photo_url || userSvg}
            alt="Мое фото"
            className={classes.menu_photo}
          />
        </a>
        <div className={classes.iconWrapper} onClick={showModal}>
          <MdOutlinePhotoCamera size={16} className={classes.menu_icon} />
        </div>
      </div>
      <h2>
        {user.last_name} {user.first_name} {user.middle_name}
      </h2>
      <div className={classes.menu_links}>
        <ul className={classes.navLinks}>
          {routes.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path}>
                <CustomLink
                  to={item.path}
                  commonClass={""}
                  activeClass={classes.active}
                  onClick={() => closeMenu(item.path)}
                >
                  {IconComponent && (
                    <IconComponent size={24} className={classes.nav_icon} />
                  )}
                  {item.name}
                </CustomLink>
              </li>
            );
          })}
        </ul>
        <ul className={classes.navLinks}>
          <li>
            <CustomLink
              to="/profile/me"
              commonClass={""}
              activeClass={classes.active}
            >
              <LuUserRound size={24} className={classes.nav_icon} />
              Личные данные
            </CustomLink>
          </li>
          <li>
            <a href="/" onClick={(e) => exitHandler(e, "/exit")}>
              <MdLogout size={24} className={classes.nav_icon} />
              Выход
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
