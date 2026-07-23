import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import plural from "plural-ru";
import { useFetching } from "../../../hooks/useFetching";
import { useFilter } from "../../../hooks/useFilter";
import { useNotification } from "../../../hooks/useNotification";
import RequestService from "../../../services/RequestService";
import SearchInput from "../../../components/SearchInput/SearchInput";
import List from "../../../components/List/List";
import EmptyRequests from "../../../components/EmptyRequests/EmptyRequests";
import DoctorRequest from "../../../components/Request/DoctorRequest/DoctorRequest";
import MyButton from "../../../UI/MyButton/MyButton";
import Loader from "../../../UI/Loader/Loader";
import MyError from "../../../UI/MyError/MyError";
import classes from "./DoctorRequests.module.css";

// Список статусов для кнопок
const requestStatuses = [
  { status: "Ожидание", label: "Новые" },
  { status: "Активный", label: "Активные" },
  { status: "Завершено", label: "Завершенные" },
];

// NotFound-сообщения в зависимости от статуса
const statusMessages = {
  Ожидание: {
    description: "У вас пока нет новых заявок от пациентов",
    action: "Ожидайте поступления запросов на консультацию",
  },
  Активный: {
    description: "У вас пока нет активных консультаций",
    action: "Активные приемы появятся здесь после подтверждения заявок",
  },
  Завершено: {
    description: "У вас пока нет завершенных консультаций",
    action:
      "История приемов будет доступна здесь после завершения консультаций",
  },
};

export default function DoctorRequests({ initialStatus = "Ожидание" }) {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState(initialStatus);

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
    const fullName = `${request.patient.last_name} ${request.patient.first_name} ${request.patient.middle_name}`;
    const patientCity = request.patient.city;

    return (
      request.status === status &&
      (fullName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
        patientCity
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

  const [notifyAccept] = useNotification({
    successMsg: "Заявка успешно принята!",
    errorMsg: "При попытке принять заявку произошла ошибка",
  });

  const [notifyReject] = useNotification({
    successMsg: "Заявка успешно отклонена",
    errorMsg: "В процессе отклонения заявки произошла ошибка",
  });

  const [notifyComplete] = useNotification({
    successMsg: "Консультация успешно завершена!",
    errorMsg: "При попытке завершить консультацию произошла ошибка",
  });

  const updateRequest = async (request_id, status) => {
    await RequestService.update_request(request_id, status);
    setRequests(
      requests.map((request) =>
        request.id === request_id ? { ...request, status } : request
      )
    );
  };

  const handleAccept = async (request_id, status) => {
    await notifyAccept(updateRequest, request_id, status);
  };

  const handleReject = async (request_id, status) => {
    await notifyReject(updateRequest, request_id, status);
  };

  const handleComplete = async (request_id, status) => {
    await notifyComplete(updateRequest, request_id, status);
  };

  const renderEmptyList = () => (
    <EmptyRequests
      role="Врач"
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
          <DoctorRequest
            key={item.id}
            request={item}
            onAccept={handleAccept}
            onReject={handleReject}
            onComplete={handleComplete}
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
