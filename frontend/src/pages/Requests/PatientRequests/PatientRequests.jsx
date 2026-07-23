import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import plural from "plural-ru";
import { useFetching } from "../../../hooks/useFetching";
import { useFilter } from "../../../hooks/useFilter";
import { useStatus } from "../../../hooks/useStatus";
import RequestService from "../../../services/RequestService";
import SearchInput from "../../../components/SearchInput/SearchInput";
import List from "../../../components/List/List";
import EmptyRequests from "../../../components/EmptyRequests/EmptyRequests";
import PatientRequest from "../../../components/Request/PatientRequest/PatientRequest";
import MyButton from "../../../UI/MyButton/MyButton";
import Loader from "../../../UI/Loader/Loader";
import MyError from "../../../UI/MyError/MyError";
import classes from "./PatientRequests.module.css";

// Список статусов для кнопок
const requestStatuses = [
  { status: "Ожидание", label: "Новые" },
  { status: "Активный", label: "Активные" },
  { status: "Завершено", label: "Завершенные" },
];

// NotFound-сообщения в зависимости от статуса
const statusMessages = {
  Ожидание: {
    description: "У вас пока нет новых заявок",
    action: "Выберите подходящего специалиста и запишитесь к нему на прием!",
  },
  Активный: {
    description: "У вас пока нет активных консультаций",
    action: "Новые заявки появятся здесь после подтверждения врача",
  },
  Завершено: {
    description: "У вас пока нет завершенных консультаций",
    action: "Завершенные консультации появятся здесь после окончания приема",
  },
};

export default function PatientRequests() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("Ожидание");

  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get("query") || "";

  const [requestFetching, isLoading, isError, error] = useFetching(async () => {
    const response = await RequestService.get_requests();
    setRequests(response.data);
  });

  useEffect(() => {
    requestFetching();
  }, []);

  const statusCounts = useMemo(() => {
    return requests.reduce(
      (acc, item) => ({ ...acc, [item.status]: acc[item.status] + 1 }),
      Object.fromEntries(requestStatuses.map((item) => [item.status, 0]))
    );
  }, [requests]);

  const filterRequests = (request) => {
    const fullName = `${request.doctor.last_name} ${request.doctor.first_name} ${request.doctor.middle_name}`;
    const doctorPost = request.doctor.post;

    return (
      request.status === status &&
      (fullName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
        doctorPost
          .toLocaleLowerCase()
          .includes(searchValue.toLocaleLowerCase()))
    );
  };

  const filteredRequests = useFilter(
    [status, searchValue],
    requests,
    filterRequests
  );

  const clearSearch = () => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("query");
      return newParams;
    });
  };

  const [notifyResubmit, notifyComplete, notifyCancel] = useStatus();

  const handleResubmit = async (doctor_id) => {
    await notifyResubmit(async () => {
      const response = await RequestService.create_request(doctor_id);
      const last_request = response.data;
      setRequests([last_request, ...requests]);
    });
  };

  const handleComplete = async (request_id, status) => {
    await notifyComplete(async () => {
      await RequestService.update_request(request_id, status);
      setRequests(
        requests.map((request) =>
          request.id === request_id ? { ...request, status } : request
        )
      );
    });
  };

  const handleCancel = async (request_id, status) => {
    await notifyCancel(async () => {
      await RequestService.update_request(request_id, status);
      setRequests(
        requests.map((request) =>
          request.id === request_id ? { ...request, status } : request
        )
      );
    });
  };

  const renderEmptyList = () => (
    <EmptyRequests
      role="Пациент"
      statusMessages={statusMessages}
      status={status}
      searchValue={searchValue}
      onClearSearch={clearSearch}
    />
  );

  const renderRequestList = () => {
    if (isLoading)
      return <Loader containerClassName={classes.requestsLoader} />;
    if (isError)
      return (
        <MyError message={error} containerClassName={classes.errorSection} />
      );

    return (
      <List
        items={filteredRequests}
        renderItem={(item, _) => (
          <PatientRequest
            key={item.id}
            request={item}
            onCancel={handleCancel}
            onComplete={handleComplete}
            onResubmit={handleResubmit}
          />
        )}
        renderEmptyList={renderEmptyList}
        className={classes.requestGrid}
      />
    );
  };

  return (
    <div className={classes.requests}>
      <div className={classes.btnSection}>
        {requestStatuses.map((item) => (
          <MyButton
            key={item.status}
            className={`${classes.requestBtn} ${
              status === item.status
                ? classes.requestBtnActive
                : classes.requestBtnPassive
            }
          `}
            onClick={() => setStatus(item.status)}
          >
            <p>{item.label}</p>
            <p className={classes.requestCount}>{statusCounts[item.status]}</p>
          </MyButton>
        ))}
      </div>
      <SearchInput
        searchValue={searchValue}
        setSearchParams={setSearchParams}
      />
      <div className={classes.foundResult}>{`${plural(
        filteredRequests.length,
        "Найдена",
        "Найдено",
        "Найдено"
      )} ${filteredRequests.length} ${plural(
        filteredRequests.length,
        "заявка",
        "заявки",
        "заявок"
      )}`}</div>
      {renderRequestList()}
    </div>
  );
}
