import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import plural from "plural-ru";
import UserService from "../../services/UserService";
import PredictionService from "../../services/PredictionService";
import { useFetching } from "../../hooks/useFetching";
import { TbArrowBackUp } from "react-icons/tb";
import { IoPeopleSharp } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { calculateAge } from "../../utils/date";
import DoctorPrediction from "./DoctorPrediction/DoctorPrediction";
import List from "../../components/List/List";
import Loader from "../../UI/Loader/Loader";
import MyButton from "../../UI/MyButton/MyButton";
import EmptyList from "../../UI/EmptyList/EmptyList";
import classes from "./DoctorPredictions.module.css";

export default function DoctorPredictions() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const handleGoHome = () => navigate("/home");
  const handleBack = () => navigate("/patients");

  const [patient, setPatient] = useState(null);
  const [predictions, setPredictions] = useState([]);

  const [predFetching, isPredLoading] = useFetching(async (patientId) => {
    const response = await PredictionService.get_predictions_by_patient(
      patientId
    );
    setPredictions(response.data);
  });

  const [patientFetching, isPatientLoading] = useFetching(async (patientId) => {
    const response = await UserService.get_patient_by_id(patientId);
    setPatient(response.data);
  });

  useEffect(() => {
    patientFetching(patientId);
    predFetching(patientId);
  }, []);

  const renderPatientTags = () => {
    if (isPatientLoading)
      return (
        <Loader
          containerClassName={classes.loaderContainer}
          loaderClassName={classes.patientLoader}
        />
      );
    return (
      <div className={classes.headerTags}>
        <p>
          {patient?.last_name} {patient?.first_name} {patient?.middle_name}
        </p>
        <p>
          {calculateAge(patient?.birth_date)}{" "}
          {plural(calculateAge(patient?.birth_date), "год", "года", "лет")}
        </p>
        <p className={classes.headerCity}>
          <FaLocationDot size={16} /> г. {patient?.city}
        </p>
      </div>
    );
  };

  return (
    <div className={classes.predictions}>
      <div className={classes.header}>
        <div className={classes.btnContainer}>
          <MyButton className={classes.backButton} onClick={handleGoHome}>
            <TbArrowBackUp size={22} />
            На главную
          </MyButton>
          <MyButton className={classes.backButton} onClick={handleBack}>
            <IoPeopleSharp size={20} />
            Пациенты
          </MyButton>
        </div>
        <div className={classes.headerText}>
          <h3>Прогнозы</h3>
          {renderPatientTags()}
        </div>
      </div>
      {isPredLoading ? (
        <Loader containerClassName={classes.predLoader} />
      ) : (
        <List
          className={classes.tests_list}
          items={predictions}
          renderItem={(prediction) => (
            <DoctorPrediction
              key={prediction.id}
              patientId={patientId}
              prediction={prediction}
            />
          )}
          renderEmptyList={() => (
            <EmptyList
              text="Пока нет доступных прогнозов"
              containerClassName={classes.predEmpty}
            />
          )}
        />
      )}
    </div>
  );
}
