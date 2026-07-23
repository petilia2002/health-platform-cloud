import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Divider } from "antd";
import plural from "plural-ru";
import { useFetching } from "../../hooks/useFetching";
import { useStatus } from "../../hooks/useStatus";
import UserService from "../../services/UserService";
import RequestService from "../../services/RequestService";
import DoctorItem from "../../components/Doctor/DoctorItem/DoctorItem";
import DoctorNotFound from "../../components/Doctor/DoctorNotFound/DoctorNotFound";
import SearchInput from "../../components/SearchInput/SearchInput";
import List from "../../components/List/List";
import Loader from "../../UI/Loader/Loader";
import classes from "./Doctors.module.css";

export default function Doctors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get("query") || "";

  const [doctors, setDoctors] = useState([]);
  const [doctorsFetching, isDoctorsLoading] = useFetching(async (query) => {
    const response = await UserService.get_doctors(query);
    setDoctors(response.data);
  });

  const [notifyResubmit, notifyComplete, notifyCancel] = useStatus();

  const handleResubmit = async (doctor_id) => {
    await notifyResubmit(async () => {
      const response = await RequestService.create_request(doctor_id);
      const last_request = response.data;
      setDoctors(
        doctors.map((doctor) =>
          doctor.doctor_id === doctor_id ? { ...doctor, last_request } : doctor
        )
      );
    });
  };

  const handleComplete = async (request_id, status) => {
    await notifyComplete(async () => {
      const response = await RequestService.update_request(request_id, status);
      setDoctors(
        doctors.map((doctor) =>
          doctor.last_request?.id === request_id
            ? { ...doctor, last_request: response.data }
            : doctor
        )
      );
    });
  };

  const handleCancel = async (request_id, status) => {
    await notifyCancel(async () => {
      const response = await RequestService.update_request(request_id, status);
      setDoctors(
        doctors.map((doctor) =>
          doctor.last_request?.id === request_id
            ? { ...doctor, last_request: response.data }
            : doctor
        )
      );
    });
  };

  useEffect(() => {
    doctorsFetching(searchValue);
  }, [searchValue]);

  const clearSearch = () => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("query");
      return newParams;
    });
  };

  const renderEmptyList = () => <DoctorNotFound handleClear={clearSearch} />;

  return (
    <div className={classes.doctors}>
      <div className={classes.doctorsContainer}>
        <h3>Выбор специалиста</h3>
        <SearchInput
          searchValue={searchValue}
          setSearchParams={setSearchParams}
          placeholder="ФИО / Специальность / Адрес"
          className={classes.doctorSearch}
        />
        <div className={classes.foundResult}>{`${plural(
          doctors.length,
          "Найден",
          "Найдено",
          "Найдено"
        )} ${doctors.length} ${plural(
          doctors.length,
          "врач",
          "врача",
          "врачей"
        )}`}</div>
      </div>
      {isDoctorsLoading ? (
        <Loader containerClassName={classes.doctorsLoader} />
      ) : (
        <List
          className={classes.doctorsGrid}
          items={doctors}
          renderItem={(doctor, _) => (
            <DoctorItem
              key={doctor.email}
              doctor={doctor}
              onCancel={handleCancel}
              onComplete={handleComplete}
              onResubmit={handleResubmit}
            />
          )}
          renderEmptyList={renderEmptyList}
        />
      )}
      {doctors.length > 0 && !isDoctorsLoading && (
        <div className={classes.footer}>
          <Divider style={{ borderColor: "#d0e6fd" }} />
          <div className={classes.textFooter}>
            Получайте расшифровку анализов крови с оценкой рисков и персональную
            консультацию врача онлайн или по телефону
          </div>
        </div>
      )}
    </div>
  );
}
