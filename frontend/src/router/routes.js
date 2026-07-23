import Main from "../pages/Main/Main";
import Layout from "../pages/Layout/Layout";
import Home from "../pages/Home/Home";
import LoginForm from "../components/AuthForm/LoginForm";
import RegisterForm from "../components/AuthForm/RegisterForm";
import Authorization from "../pages/Authorization/Authorization";
import ProfileView from "../pages/Profile/ProfileView/ProfileView";
import ProfileEdit from "../pages/Profile/ProfileEdit/ProfileEdit";
import BloodTests from "../pages/BloodTests/BloodTests";
import AddTest from "../pages/AddTest/AddTest";
import SampleView from "../pages/SampleView/SampleView";
import Doctors from "../pages/Doctors/Doctors";
import Predictions from "../pages/Predictions/Predictions";
import PredictionInfo from "../pages/PredictionInfo/PredictionInfo";
import DoctorPredictions from "../pages/DoctorPredictions/DoctorPredictions";
import DoctorPredInfo from "../pages/DoctorPredInfo/DoctorPredInfo";
import DoctorSample from "../pages/DoctorSample/DoctorSample";
import Messenger from "../pages/Messenger/Messenger";
import Requests from "../pages/Requests/Requests";
import Patients from "../pages/Patients/Patients";
import Statistics from "../pages/Statistics/Statistics";

export const routes = {
  public: [{ path: "/", element: Main }],
  unauth_only: [
    { path: "/registration", element: RegisterForm, layout: Authorization },
    { path: "/login", element: LoginForm, layout: Authorization },
  ],
  role_based: [
    {
      path: "/home",
      element: Home,
      layout: Layout,
      roles: ["Пациент", "Врач", "Администратор"],
    },
    {
      path: "/profile/:id",
      element: ProfileView,
      layout: Layout,
      roles: ["Пациент", "Врач", "Администратор"],
    },
    {
      path: "/profile/me/edit",
      element: ProfileEdit,
      layout: Layout,
      roles: ["Пациент", "Врач", "Администратор"],
    },
    {
      path: "/tests",
      element: BloodTests,
      layout: Layout,
      roles: ["Пациент"],
    },
    {
      path: "/tests/add",
      element: AddTest,
      layout: Layout,
      roles: ["Пациент"],
    },
    {
      path: "/tests/:id",
      element: SampleView,
      layout: Layout,
      roles: ["Пациент"],
    },
    {
      path: "/forecasts",
      element: Predictions,
      layout: Layout,
      roles: ["Пациент"],
    },
    {
      path: "/forecasts/:id",
      element: PredictionInfo,
      layout: Layout,
      roles: ["Пациент"],
    },
    {
      path: "/patients",
      element: Patients,
      layout: Layout,
      roles: ["Врач"],
    },
    {
      path: "/patients/:patientId/predictions",
      element: DoctorPredictions,
      layout: Layout,
      roles: ["Врач"],
    },
    {
      path: "/patients/:patientId/predictions/:predictionId",
      element: DoctorPredInfo,
      layout: Layout,
      roles: ["Врач"],
    },
    {
      path: "/patients/:patientId/samples/:sampleId",
      element: DoctorSample,
      layout: Layout,
      roles: ["Врач"],
    },
    {
      path: "/statistics",
      element: Statistics,
      layout: Layout,
      roles: ["Администратор"],
    },
    {
      path: "/messenger",
      element: Messenger,
      layout: Layout,
      roles: ["Пациент", "Врач"],
    },
    {
      path: "/requests",
      element: Requests,
      layout: Layout,
      roles: ["Пациент", "Врач"],
    },
    {
      path: "/doctors",
      element: Doctors,
      layout: Layout,
      roles: ["Пациент", "Администратор"],
    },
  ],
};
