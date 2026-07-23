import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import Menu from "./Menu/Menu";
import BottomMenu from "./BottomMenu/BottomMenu";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import classes from "./Layout.module.css";

export default function Layout() {
  const [menuIsActive, setMenuIsActive] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuIsActive(!menuIsActive);
  const closeMenu = (to) => {
    if (location.pathname !== to) {
      setMenuIsActive(false);
    }
  };

  return (
    <div className={classes.layout}>
      <header className={classes.header}>
        <Navbar />
      </header>
      <aside
        className={
          menuIsActive ? `${classes.aside} ${classes.active}` : classes.aside
        }
      >
        <Menu closeMenu={closeMenu} />
      </aside>
      <main className={classes.main}>
        <div className={classes.content}>
          <Outlet />
        </div>
        <footer className={classes.footer}>
          <Footer />
        </footer>
      </main>
      <footer className={classes.bottom}>
        <BottomMenu
          menuIsActive={menuIsActive}
          toggleMenu={toggleMenu}
          closeMenu={closeMenu}
        />
      </footer>
    </div>
  );
}
