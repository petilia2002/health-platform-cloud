import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Loading from "../pages/Loading/Loading";

export default function ProtectedRoute({
  children,
  allowedRoles = ["Пациент", "Врач", "Администратор"],
}) {
  const { isAuth, isAuthChecked, user } = useAuth();
  const location = useLocation();

  if (!isAuthChecked) {
    return <Loading />;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
