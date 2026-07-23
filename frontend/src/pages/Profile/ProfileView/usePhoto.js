import { useSelector } from "react-redux";

export const usePhoto = (profile) => {
  const { user } = useSelector((state) => state.auth);
  return user?.id === profile?.id ? user.photo_url : profile.photo;
};
