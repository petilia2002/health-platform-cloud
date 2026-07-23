import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Table } from "antd";
import { BiArrowBack } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa6";
import UserService from "../../services/UserService";
import SampleService from "../../services/SampleService";
import { useFetching } from "../../hooks/useFetching";
import reference_values from "../../data/reference_values.json";
import Loader from "../../UI/Loader/Loader";
import { isResultNormal } from "./index";
import { parseId, parseDate, parseTime } from "../../utils/parsing";
import MyError from "../../UI/MyError/MyError";
import MyButton from "../../UI/MyButton/MyButton";
import classes from "./DoctorSample.module.css";

export default function DoctorSample() {
  const { patientId, sampleId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [sample, setSample] = useState(null);

  const isValidId = /^\d+$/.test(sampleId);

  if (!isValidId) {
    return (
      <div className={classes.errorContainer}>
        <p>Неверный формат ID анализа. Ожидается числовой идентификатор.</p>
      </div>
    );
  }

  const [fetchPatient] = useFetching(async (patientId) => {
    const response = await UserService.get_patient_by_id(patientId);
    setPatient(response.data);
  });

  const [fetching, isLoading, isError, error] = useFetching(
    async (sampleId) => {
      const response = await SampleService.get_sample_by_patient(sampleId);
      setSample(response.data);
    }
  );

  useEffect(() => {
    if (isValidId) {
      fetchPatient(patientId);
      fetching(sampleId);
    }
  }, []);

  const handleBack = () => navigate(-1);

  const getReferenceRange = (metric_key) => {
    const gender = patient?.gender;
    if (!metric_key || !gender) return null;

    const referenceObject = reference_values[metric_key]?.[gender];
    if (!referenceObject) return null;

    if (referenceObject.min && referenceObject.max) {
      return `${referenceObject.min} – ${referenceObject.max}`;
    }

    if (referenceObject.min) {
      return `> ${referenceObject.min}`;
    }

    if (referenceObject.max) {
      return `< ${referenceObject.max}`;
    }

    return null;
  };

  const columns = [
    {
      title: "Показатель",
      dataIndex: "analyte",
      key: "analyte",
      width: "40%",
      render: (text, record) => {
        const isNormal = isResultNormal(record.result, record.reference);
        return (
          <div className={classes.metricName}>
            <span style={{ color: "#3f8cf4" }}>{text}</span>
            {!isNormal && <div className={classes.redCircle}></div>}
          </div>
        );
      },
    },
    {
      title: "Результат",
      dataIndex: "result",
      key: "result",
      width: "20%",
      render: (value, record) => {
        const isNormal = isResultNormal(value, record.reference);
        return (
          <div className={classes.valueContainer}>
            <span
              style={{
                color: isNormal ? "#3f8cf4" : "#ff4d4f",
                fontWeight: 500,
              }}
            >
              {value}
            </span>
          </div>
        );
      },
    },
    {
      title: "Ед. измерения",
      dataIndex: "units",
      key: "units",
      width: "20%",
      render: (text) => <span style={{ color: "#3f8cf4" }}>{text}</span>,
    },
    {
      title: "Реф. значения",
      dataIndex: "reference",
      key: "reference",
      width: "20%",
      render: (value, record) => {
        const isNormal = isResultNormal(record.result, value);
        return (
          <div className={classes.valueContainer}>
            <span
              style={{
                color: isNormal ? "#3f8cf4" : "#ff4d4f",
                fontSize: "16px",
              }}
            >
              {value || "Нет данных"}
            </span>
          </div>
        );
      },
    },
  ];

  const tableData = sample?.results
    ? sample.results.map((res) => ({
        key: res.analyte_view_name,
        analyte: res.analyte_name,
        result: res.value,
        units: res.units,
        reference: getReferenceRange(res.analyte_view_name) || "–",
      }))
    : [];

  if (isLoading) {
    return <Loader containerClassName={classes.loaderContainer} />;
  }

  return (
    <div className={classes.sampleView}>
      <div className={classes.sampleHeader}>
        <p className={classes.sampleTitle}>
          Результаты анализов <strong>{parseId(sample?.id)}</strong> от{" "}
          <strong>{parseDate(sample?.upload_date)}</strong> в{" "}
          <strong>{parseTime(sample?.upload_date)}</strong>
        </p>
        <div className={classes.btnContainer}>
          <MyButton className={classes.toggleButton} onClick={() => {}}>
            <FaRegUser />
            Профиль пациента
          </MyButton>
          <MyButton className={classes.backButton} onClick={handleBack}>
            <p>Назад</p>
            <BiArrowBack size={22} className={classes.backIcon} />
          </MyButton>
        </div>
      </div>

      {isError ? (
        <MyError containerClassName={classes.errorContainer} message={error} />
      ) : (
        <Table
          columns={columns}
          dataSource={tableData}
          className={classes.sampleTable}
          pagination={{
            position: ["bottomRight"],
            defaultPageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "15"],
            locale: {
              items_per_page: "/ стр.",
            },
          }}
        />
      )}
    </div>
  );
}
