import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Empty } from "antd";
import PredictionService from "../../services/PredictionService";
import SampleService from "../../services/SampleService";
import { useModal } from "../../hooks/useModal";
import { useFetching } from "../../hooks/useFetching";
import { useMessage } from "../../hooks/useMessage";
import { TbArrowBackUp } from "react-icons/tb";
import { MdLibraryAdd } from "react-icons/md";
import PredictionItem from "../../components/Prediction/PredictionItem/PredictionItem";
import ModalWindow from "../../components/ModalWindow/ModalWindow";
import { parseTime, parseDate } from "../../utils/parsing";
import List from "../../components/List/List";
import Loader from "../../UI/Loader/Loader";
import MyButton from "../../UI/MyButton/MyButton";
import EmptyList from "../../UI/EmptyList/EmptyList";
import classes from "./Predictions.module.css";

export default function Predictions() {
  const navigate = useNavigate();
  const handleBack = () => navigate("/home");

  const [predictions, setPredictions] = useState([]);
  const [samples, setSamples] = useState([]);

  const [predFetching, isPredLoading] = useFetching(async () => {
    const response = await PredictionService.get_predictions();
    setPredictions(response.data);
  });

  const [sampleFetching] = useFetching(async () => {
    const response = await SampleService.get_samples();
    setSamples(response.data);
  });

  useEffect(() => {
    predFetching();
    sampleFetching();
  }, []);

  const [handleGenerate] = useMessage({
    successMsg: "Прогноз успешно создан!",
    errorMsg: "Возникла ошибка при создании",
  });

  const [handleDelete] = useMessage({
    successMsg: "Прогноз успешно удален!",
    errorMsg: "Возникла ошибка при удалении",
  });

  const [
    modal,
    setModal,
    search,
    setSearch,
    error,
    _,
    handleSubmit,
    closeModal,
  ] = useModal(async () => {
    await handleGenerate(async () => {
      const response = await PredictionService.create_prediction(search);
      setPredictions([response.data, ...predictions]);
    });
  }, "Необходимо указать анализ крови");

  const deletePrediction = async (id) => {
    await handleDelete(async () => {
      await PredictionService.delete_prediction(id);
      setPredictions(predictions.filter((item) => item.id != id));
    });
  };

  const options = samples.map((sample) => ({
    value: sample.id,
    label: `${sample.results.length > 10 ? "Биохимия" : "ОАК"} от ${parseDate(
      sample.upload_date,
    )} в ${parseTime(sample.upload_date)}`,
  }));

  return (
    <div className={classes.predictions}>
      <ModalWindow
        modal={modal}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        options={options}
        search={search}
        setSearch={setSearch}
        errMsg={error}
        placeholder={"Выберите анализ крови"}
        formTitle={"Создание прогноза"}
        searchTitle={"Укажите анализ крови:"}
        btnTitle={"Сгенерировать"}
        notFoundContent={
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={null}>
            <div>
              Не найдено <Link to="/tests/add">анализов</Link>
            </div>
          </Empty>
        }
        searchClassName={classes.formSearch}
      />
      <div className={classes.header}>
        <div className={classes.btnContainer}>
          <MyButton className={classes.backButton} onClick={handleBack}>
            <TbArrowBackUp size={22} />
            На главную
          </MyButton>
          <MyButton
            className={classes.backButton}
            onClick={() => setModal(!modal)}
          >
            <MdLibraryAdd size={22} />
            Новый прогноз
          </MyButton>
        </div>
        <h3>Мои прогнозы</h3>
      </div>
      {isPredLoading ? (
        <Loader containerClassName={classes.predLoader} />
      ) : (
        <List
          className={classes.tests_list}
          items={predictions}
          renderItem={(prediction) => (
            <PredictionItem
              key={prediction.id}
              prediction={prediction}
              deletePrediction={deletePrediction}
            />
          )}
          renderEmptyList={() => (
            <EmptyList
              text="У вас пока нет прогнозов"
              containerClassName={classes.predEmpty}
            />
          )}
        />
      )}
    </div>
  );
}
