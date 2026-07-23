import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { FaNoteSticky } from "react-icons/fa6";
import { BiArrowBack } from "react-icons/bi";
import { useFetching } from "../../hooks/useFetching";
import PredictionService from "../../services/PredictionService";
import { parseId, parseDate, parseTime } from "../../utils/parsing";
import Loader from "../../UI/Loader/Loader";
import MyError from "../../UI/MyError/MyError";
import MyButton from "../../UI/MyButton/MyButton";
import PredTable from "../../components/Prediction/PredTable/PredTable";
import EditComment from "../../components/Prediction/EditComment/EditComment";
import classes from "./DoctorPredInfo.module.css";

export default function DoctorPredInfo() {
  const { patientId, predictionId } = useParams();
  const navigate = useNavigate();

  const [prediction, setPrediction] = useState(null);

  const isPositive = prediction?.results.find(
    (res) => res.conclusion === "positive"
  );

  const [fetchPrediction, isLoading, isError, error] = useFetching(
    async (patientId, predictionId) => {
      const response = await PredictionService.get_prediction_by_patient(
        patientId,
        predictionId
      );
      setPrediction(response.data);
    }
  );

  const isValidParam = (param) => {
    const num = Number(param);
    return Number.isInteger(num) && num > 0;
  };

  const isValidId = isValidParam(patientId) && isValidParam(predictionId);

  useEffect(() => {
    if (isValidId) {
      fetchPrediction(patientId, predictionId);
    }
  }, [patientId, predictionId]);

  const handleBack = () => navigate(`/patients/${patientId}/predictions`);

  if (!isValidId) {
    return (
      <div className={classes.errorSection}>
        <MyError
          message={
            "Некорректный параметр запроса: id пациента и прогноза должны быть целыми числами"
          }
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={classes.predictionInfo}>
        <Loader containerClassName={classes.loaderSection} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={classes.predictionInfo}>
        <MyError message={error} containerClassName={classes.sectionError} />
      </div>
    );
  }

  return (
    <div className={classes.predictionInfo}>
      <div className={classes.header}>
        <p>
          Прогноз <strong>{parseId(predictionId)}</strong> от{" "}
          <strong>{parseDate(prediction?.creation_date)}</strong> в{" "}
          <strong>{parseTime(prediction?.creation_date)}</strong>{" "}
          {isPositive && <span className={classes.redCircle}></span>}
        </p>
        <div className={classes.btnSection}>
          <MyButton
            className={classes.accessBtn}
            onClick={() =>
              navigate(`/patients/${patientId}/samples/${prediction.sample_id}`)
            }
          >
            <FaNoteSticky size={18} />
            <p>Посмотреть анализ</p>
          </MyButton>
          <MyButton className={classes.accessBtn} onClick={handleBack}>
            <p>Назад</p>
            <BiArrowBack size={22} className={classes.backIcon} />
          </MyButton>
        </div>
      </div>
      {prediction && (
        <PredTable
          className={classes.infoTable}
          results={prediction?.results}
        />
      )}
      <EditComment
        patientId={patientId}
        prediction={prediction}
        setPrediction={setPrediction}
      />
    </div>
  );
}
