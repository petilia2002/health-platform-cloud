import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import EditForm from "./EditForm/EditForm";
import StateHandler from "../../../components/StateHandler/StateHandler";
import { useFetching } from "../../../hooks/useFetching";
import UserService from "../../../services/UserService";

export default function ProfileEdit() {
  const { user } = useAuth();
  const userId = user.id;

  const [profile, setProfile] = useState(null);

  const [fetching, isLoading, isError, error] = useFetching(async (userId) => {
    const response = await UserService.get_profile(userId);
    setProfile(response.data);
  });

  const fetchProfile = () => {
    if (userId) {
      fetching(userId);
    } else {
      message.error({ content: "Некорректный ID", duration: 2 });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <StateHandler
      isLoading={isLoading}
      isError={isError}
      error={error}
      retryHandler={fetchProfile}
      isValidId={userId}
      message={"ID профиля должен быть целым положительным числом"}
    >
      <EditForm profile={profile} />
    </StateHandler>
  );
}
