import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Loading from "../pages/Loading/Loading";

export default function UnAuthRoute({ children }) {
  const { isAuth, isAuthChecked } = useAuth();

  if (!isAuthChecked) {
    return <Loading />;
  }

  if (isAuth) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
