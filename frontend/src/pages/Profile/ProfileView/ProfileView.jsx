import { App } from "antd";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import PatientProfile from "./PatientProfile/PatientProfile";
import DoctorProfile from "./DoctorProfile/DoctorProfile";
import AdminProfile from "./AdminProfile/AdminProfile";
import StateHandler from "../../../components/StateHandler/StateHandler";
import { useFetching } from "../../../hooks/useFetching";
import UserService from "../../../services/UserService";
import { useAuth } from "../../../hooks/useAuth";
import { validateId } from "../../../utils/validation";

export default function ProfileView() {
  const { user } = useAuth();
  const { id: urlParam } = useParams();
  const [profile, setProfile] = useState(null);
  const { message } = App.useApp();

  const userId = urlParam === "me" ? user.id : urlParam;
  const isValidId = validateId(userId);

  const [fetching, isLoading, isError, error] = useFetching(async (userId) => {
    const response = await UserService.get_profile(userId);
    setProfile(response.data);
  });

  const fetchProfile = () => {
    if (isValidId) {
      fetching(userId);
    } else {
      message.error({ content: "Некорректный ID", duration: 2 });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const renderProfile = () => {
    if (profile?.role === "Пациент") {
      return <PatientProfile profile={profile} />;
    }

    if (profile?.role === "Врач") {
      return <DoctorProfile profile={profile} />;
    }

    if (profile?.role === "Администратор") {
      return <AdminProfile profile={profile} />;
    }
  };

  return (
    <StateHandler
      isLoading={isLoading}
      isError={isError}
      error={error}
      retryHandler={fetchProfile}
      isValidId={isValidId}
      message={"ID профиля должен быть целым положительным числом"}
    >
      {renderProfile()}
    </StateHandler>
  );
}
