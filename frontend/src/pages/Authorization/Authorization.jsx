import { Outlet } from "react-router";
import AuthNavbar from "./AuthNavbar/AuthNavbar";
import Footer from "../Layout/Footer/Footer";
import classes from "./Authorization.module.css";

export default function Authorization() {
  return (
    <div className={classes.auth}>
      <header className={classes.header}>
        <AuthNavbar />
      </header>
      <main className={classes.main_content}>
        <Outlet />
      </main>
      <footer className={classes.footer}>
        <Footer />
      </footer>
    </div>
  );
}
