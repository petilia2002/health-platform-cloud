import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Empty } from "antd";
import { useFetching } from "../../hooks/useFetching";
import { useModal } from "../../hooks/useModal";
import { useMessage } from "../../hooks/useMessage";
import PredictionService from "../../services/PredictionService";
import RequestService from "../../services/RequestService";
import { convertUTCToLocal } from "../../utils/date";
import { parseId, parseDate, parseTime } from "../../utils/parsing";
import AccessBtn from "./AccessBtn/AccessBtn";
import ModalWindow from "../../components/ModalWindow/ModalWindow";
import Loader from "../../UI/Loader/Loader";
import MyError from "../../UI/MyError/MyError";
import PredTable from "../../components/Prediction/PredTable/PredTable";
import Comment from "../../components/Prediction/Comment/Comment";
import classes from "./PredictionInfo.module.css";

const getNotificationMessage = (status, comment) => {
  if (!comment) {
    return {
      successMsg: "Запрос на комментарий успешно отозван",
      errorMsg: "При отмене запроса произошла ошибка",
    };
  }

  switch (status) {
    case "Активный":
      return {
        successMsg: "Доступ к прогнозу закрыт",
        errorMsg: "При попытке закрыть доступ произошла ошибка",
      };
    case "Завершено":
      return {
        successMsg: "Доступ для врача снова открыт",
        errorMsg: "При попытке открыть доступ произошла ошибка",
      };
    default:
      return {};
  }
};

export default function PredictionInfo() {
  const { id } = useParams();
  const isValidId = Number.isInteger(Number(id)) && Number(id) > 0;

  const [prediction, setPrediction] = useState(null);
  const [requests, setRequests] = useState([]);

  const accessId = prediction?.access?.id;
  const sampleId = prediction?.sample_id;
  const accessStatus = prediction?.access?.status;
  const doctorComment = prediction?.doctor_comment;

  const isPositive = prediction?.results.find(
    (res) => res.conclusion === "positive",
  );

  const [fetchPrediction, isLoading, isError, error] = useFetching(
    async (id) => {
      const response = await PredictionService.get_prediction_by_id(id);
      setPrediction(response.data);
    },
  );

  const [fetchRequests] = useFetching(async () => {
    const response = await RequestService.get_requests("Активный");
    setRequests(response.data);
  });

  useEffect(() => {
    if (isValidId) {
      fetchPrediction(id);
      fetchRequests();
    }
  }, [id]);

  const [handleRequest] = useMessage({
    successMsg: "Комментарий успешно запрошен!",
    errorMsg: "Пожалуйста, исправьте ошибки в форме",
  });

  const [handleUpdate] = useMessage(
    getNotificationMessage(accessStatus, doctorComment),
  );

  const [
    modal,
    setModal,
    search,
    setSearch,
    modalError,
    _,
    handleSubmit,
    closeModal,
  ] = useModal(async (prediction_id, request_id) => {
    await handleRequest(async () => {
      const response = await RequestService.create_access(
        prediction_id,
        request_id,
      );
      setPrediction(response.data);
    });
  }, "Необходимо указать специалиста");

  const createAccess = () => {
    setModal(!modal);
  };

  const updateAccess = async (access_id, access_status) => {
    await handleUpdate(async () => {
      const response = await RequestService.update_access(
        access_id,
        access_status,
      );
      setPrediction(response.data);
    });
  };

  const options = requests.map((request) => {
    const id = request.id;
    const doctor = request.doctor;

    return {
      value: id,
      label: `${doctor.last_name} ${
        doctor.first_name
      }, ${doctor.post.toLowerCase()}`,
    };
  });

  if (!isValidId) {
    return (
      <div className={classes.errorSection}>
        <MyError
          message={
            "Некорректный параметр запроса: id прогноза должен быть целым числом"
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
      <ModalWindow
        modal={modal}
        closeModal={closeModal}
        handleSubmit={() => handleSubmit(prediction.id, search)}
        options={options}
        search={search}
        setSearch={setSearch}
        errMsg={modalError}
        placeholder={"Выберите специалиста"}
        formTitle={"Запросить комментарий"}
        searchTitle={"Укажите врача:"}
        btnTitle={"Отправить"}
        notFoundContent={
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={null}>
            <div>
              Не найдено активных <Link to="/doctors">врачей</Link>
            </div>
          </Empty>
        }
        searchClassName={classes.formSearch}
      />
      <div className={classes.header}>
        <p>
          Прогноз <strong>{parseId(id)}</strong> от{" "}
          <strong>
            {parseDate(convertUTCToLocal(prediction?.creation_date))}
          </strong>{" "}
          в{" "}
          <strong>
            {parseTime(convertUTCToLocal(prediction?.creation_date))}
          </strong>{" "}
          {isPositive && <span className={classes.redCircle}></span>}
        </p>
        <AccessBtn
          createAccess={createAccess}
          updateAccess={updateAccess}
          id={accessId}
          sampleId={sampleId}
          status={accessStatus}
          comment={doctorComment}
        />
      </div>
      {prediction && (
        <PredTable
          className={classes.infoTable}
          results={prediction?.results}
        />
      )}
      <Comment
        access={prediction?.access}
        doctor={prediction?.doctor}
        comment={doctorComment}
        comment_date={prediction?.comment_date}
        setModal={setModal}
      />
    </div>
  );
}
