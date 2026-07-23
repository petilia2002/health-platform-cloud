import plural from "plural-ru";
import dayjs from "dayjs";
import { formAttributes } from "./profile";

const roleMap = {
  Пациент: "patient",
  Врач: "doctor",
  Администратор: "admin",
};

const genderMap = {
  male: "Мужчина",
  female: "Женщина",
  Мужчина: "male",
  Женщина: "female",
};

export const useProfile = (role) => {
  if (!role) return [];
  const userRole = roleMap[role];
  return [...formAttributes["shared"], ...(formAttributes[userRole] || [])];
};

const getUserInitial = (profile) => ({
  last_name: profile?.last_name,
  first_name: profile?.first_name,
  middle_name: profile?.middle_name,
  birth_date: profile?.birth_date ? dayjs(profile.birth_date) : null,
  gender: genderMap[profile?.gender],
  email: profile?.email,
  city: profile?.city,
  phone: profile?.phone,
});

const getPatientInitial = (profile) => ({
  height: profile?.height,
  weight: profile?.weight,
  blood_type: profile?.blood_type,
});

const getDoctorInitial = (profile) => ({
  place_employment: profile?.place_employment,
  post: profile?.post,
  specialization: profile?.specialization,
  education: profile?.education,
  experience: profile?.experience,
  bio: profile?.bio,
});

const getAdminInitial = () => ({});

const roleInitializers = {
  Пациент: getPatientInitial,
  Врач: getDoctorInitial,
  Администратор: getAdminInitial,
};

export const getFormInitial = (profile) => {
  if (!profile || typeof profile !== "object") {
    return {};
  }

  const sharedObj = getUserInitial(profile);
  const roleInitializer = roleInitializers[profile.role];
  const roleObj = roleInitializer ? roleInitializer(profile) : {};

  return { ...sharedObj, ...roleObj };
};

export const transformToFormData = (values) => {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (key === "photo") return;

    if (value === null || value === undefined || value === "") {
      return;
    }

    let formattedValue = value;
    if (key === "birth_date" && value) {
      formattedValue = value.format("YYYY-MM-DD");
    }

    if (key === "gender" && value) {
      formattedValue = genderMap[value];
    }

    formData.append(key, formattedValue);
  });

  if (values.weight && values.height) {
    formData.append("bmi", values.weight / (values.height / 100) ** 2);
  }

  if (values.photo?.length > 0) {
    formData.append("photo", values.photo[0].originFileObj);
  }

  return formData;
};
