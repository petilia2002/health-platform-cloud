import { Link, useMatch, useResolvedPath } from "react-router";
import classes from "./CustomLink.module.css";

export default function CustomLink({
  children,
  to,
  exact = false,
  commonClass,
  activeClass,
  ...props
}) {
  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname, end: exact });

  const baseTheme = commonClass || classes.link;
  const activeTheme = activeClass || classes.active;

  return (
    <Link
      to={to}
      {...props}
      className={match ? `${baseTheme} ${activeTheme}` : baseTheme}
    >
      {children}
    </Link>
  );
}
