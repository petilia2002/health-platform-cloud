import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Table, Input, Button, Spin, Tooltip, App, Form } from "antd";
import { BiArrowBack, BiCheck, BiX } from "react-icons/bi";
import { PlusOutlined } from "@ant-design/icons";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import SampleService from "../../services/SampleService";
import { useFetching } from "../../hooks/useFetching";
import { useMessage } from "../../hooks/useMessage";
import { useAuth } from "../../hooks/useAuth";
import reference_values from "../../data/reference_values.json";
import applicability_domain from "../../data/applicability_domain.json";
import Loader from "../../UI/Loader/Loader";
import { isResultNormal, requiredMetrics, additionalMetrics } from "./index";
import { convertUTCToLocal } from "../../utils/date";
import { parseId, parseDate, parseTime } from "../../utils/parsing";
import { validateField, formDataProcess } from "../../utils/validateField";
import MyError from "../../UI/MyError/MyError";
import MyButton from "../../UI/MyButton/MyButton";
import MyModal from "../../UI/MyModal/MyModal";
import MySearch from "../../UI/MySearch/MySearch";
import classes from "./SampleView.module.css";

const validateValue = (key, value) => {
  const min = applicability_domain[key].min;
  const max = applicability_domain[key].max;

  if (!value) {
    return { isValid: false, error: "Значение должно быть числом" };
  }

  if (typeof value !== "number" || isNaN(value)) {
    return { isValid: false, error: "Значение должно быть числом" };
  }

  if (value < min || value > max) {
    return {
      isValid: false,
      error: `Значение должно быть между ${min} и ${max}`,
    };
  }

  return { isValid: true, error: null };
};

export default function SampleView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sample, setSample] = useState(null);
  const { message } = App.useApp();

  const [editingKey, setEditingKey] = useState("");
  const [editingValue, setEditingValue] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState(null);

  const { user } = useAuth();
  const isValidId = /^\d+$/.test(id);

  const [form] = Form.useForm();

  if (!isValidId) {
    return (
      <div className={classes.errorContainer}>
        <p>Неверный формат ID анализа. Ожидается числовой идентификатор.</p>
      </div>
    );
  }

  const [fetching, isLoading, isError, error] = useFetching(async () => {
    const response = await SampleService.get_sample_by_id(id);
    setSample(response.data);
  });

  useEffect(() => {
    if (isValidId) {
      fetching();
    }
  }, []);

  // const handleBack = () => {
  //   navigate("/tests");
  // };
  const handleBack = () => navigate(-1);

  const getReferenceRange = (metric_key) => {
    const referenceObject = reference_values[metric_key]?.[user.gender];
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

  const startEditing = (key, currentValue) => {
    setEditingKey(key);
    setEditingValue(currentValue.toString());
    setValidationError("");
  };

  const cancelEditing = () => {
    setEditingKey("");
    setEditingValue("");
    setValidationError("");
  };

  const handleValueChange = (e) => {
    const value = e.target.value;
    setEditingValue(value);
  };

  const saveValue = async () => {
    if (!editingKey || !sample) return;

    const numericValue = parseFloat(editingValue);
    if (isNaN(numericValue)) {
      message.error("Значение должно быть числом");
      return;
    }

    const validation = validateValue(editingKey, numericValue);
    if (!validation.isValid) {
      message.error(validation.error);
      return;
    }

    try {
      setIsSaving(true);

      const newResult = { [editingKey]: numericValue };
      const response = await SampleService.update_sample(id, newResult);
      setSample(response.data);

      message.success("Значение успешно обновлено");
      cancelEditing();
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      message.error(
        error.response?.data?.message || "Произошла ошибка при сохранении",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const [handleDeleteMessage] = useMessage({
    successMsg: "Значение успешно удалено!",
    errorMsg: "Что-то пошло не так. Попробуйте позже",
  });

  const deleteValue = async (recordKey) => {
    await handleDeleteMessage(async () => {
      const sample_data = { [recordKey]: null };
      const response = await SampleService.update_sample(
        sample.id,
        sample_data,
      );
      setSample(response.data);
    });
  };

  const [handlePostMessage] = useMessage({
    successMsg: "Значение успешно добавлено!",
    errorMsg: "Что-то пошло не так. Попробуйте позже",
  });

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

        if (editingKey === record.key) {
          return (
            <div className={classes.editingContainer}>
              <Input
                className={classes.input}
                size="small"
                value={editingValue}
                onChange={handleValueChange}
                onPressEnter={saveValue}
                onBlur={cancelEditing}
                autoFocus
                status={validationError ? "error" : ""}
                suffix={
                  <Spin spinning={isSaving} size="small">
                    {!isSaving && (
                      <>
                        <Button
                          type="text"
                          icon={<BiCheck />}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            saveValue();
                          }}
                          disabled={!!validationError}
                          size="small"
                        />
                        <Button
                          type="text"
                          icon={<BiX />}
                          onClick={cancelEditing}
                          size="small"
                        />
                      </>
                    )}
                  </Spin>
                }
              />
            </div>
          );
        }

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
            <Tooltip title="Редактировать">
              <Button
                type="text"
                icon={<MdEdit />}
                onClick={() => startEditing(record.key, value)}
                size="small"
              />
            </Tooltip>
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
            <div className={classes.deleteContainer}>
              <Tooltip title="Удалить" onClick={() => deleteValue(record.key)}>
                <FaRegTrashAlt className={classes.deleteIcon} />
              </Tooltip>
            </div>
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
        reference: getReferenceRange(res.analyte_view_name),
      }))
    : [];

  if (isLoading) {
    return <Loader containerClassName={classes.loaderContainer} />;
  }

  const optionArray = sample?.results
    ? [...requiredMetrics, ...additionalMetrics].filter(
        (metric) =>
          !sample.results.some((res) => res.analyte_view_name === metric.key),
      )
    : null;

  const options = optionArray
    ? optionArray.map((item) => ({
        value: item.key,
        label: item.label,
      }))
    : null;

  const handleSelect = (value) => {
    setSearch(value);
  };

  const currentAnalyte = search
    ? additionalMetrics.find((metric) => metric.key === search)
    : null;

  const resetForm = () => {
    form.resetFields();
    setSearch(null);
    setModal(false);
  };

  const onFinish = async (values) => {
    await handlePostMessage(async () => {
      await form.validateFields();

      const processedData = formDataProcess(values);
      const newResult = { [processedData.analyte]: processedData.result };

      const response = await SampleService.update_sample(sample.id, newResult);
      setSample(response.data);
      resetForm();
    });
  };

  return (
    <div className={classes.sampleView}>
      <div className={classes.sampleHeader}>
        <p className={classes.sampleTitle}>
          Результаты анализов <strong>{parseId(sample?.id)}</strong> от{" "}
          <strong>{parseDate(convertUTCToLocal(sample?.upload_date))}</strong> в{" "}
          <strong>{parseTime(convertUTCToLocal(sample?.upload_date))}</strong>
        </p>
        <div className={classes.btnContainer}>
          <MyButton
            className={classes.toggleButton}
            onClick={() => setModal(true)}
          >
            <PlusOutlined />
            Добавить показатель
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
          loading={isSaving}
        />
      )}

      <MyModal
        visible={modal}
        closeModal={resetForm}
        className={classes.myModal}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className={classes.form}
          validateTrigger={["onBlur", "onSubmit"]}
        >
          <Form.Item
            name={"analyte"}
            label={"Показатель"}
            rules={[
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject("Обязательное поле");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <MySearch
              options={options}
              value={search}
              onChange={handleSelect}
              placeholder={"Выберите показатель"}
              onBlur={() => form.validateFields(["analyte"])}
            />
          </Form.Item>
          <Form.Item
            name={"result"}
            label={"Значение"}
            rules={[
              {
                validator: (_, value) => {
                  if (!currentAnalyte) {
                    return Promise.reject("Показатель не выбран");
                  }
                  if (!value) {
                    return Promise.reject("Введите значение показателя");
                  }
                  return validateField(
                    value,
                    currentAnalyte?.min,
                    currentAnalyte?.max,
                  );
                },
              },
            ]}
          >
            <Input
              suffix={currentAnalyte?.units}
              placeholder="0.00"
              className={classes.modalInput}
              type="text"
            />
          </Form.Item>
          <div className={classes.actionBtns}>
            <MyButton className={classes.submitButton} type={"submit"}>
              Добавить
            </MyButton>
            <MyButton
              className={classes.cancelButton}
              onClick={resetForm}
              type={"button"}
            >
              Отмена
            </MyButton>
          </div>
        </Form>
      </MyModal>
    </div>
  );
}
