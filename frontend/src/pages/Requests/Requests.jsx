import { Navigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import PatientRequests from "./PatientRequests/PatientRequests";
import DoctorRequests from "./DoctorRequests/DoctorRequests";

export default function Requests() {
  const { user } = useAuth();

  if (user.role === "Пациент") {
    return <PatientRequests />;
  } else if (user.role === "Врач") {
    return <DoctorRequests />;
  } else {
    <Navigate to={"/login"} replace />;
  }
}
