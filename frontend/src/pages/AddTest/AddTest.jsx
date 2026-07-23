import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Divider,
  Space,
  ConfigProvider,
} from "antd";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import MyButton from "../../UI/MyButton/MyButton";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router";
import { addTestTheme, requiredMetrics, additionalMetrics } from "./index";
import { validateField, formDataProcess } from "../../utils/validateField";
import { useMessage } from "../../hooks/useMessage";
import SampleService from "../../services/SampleService";
import classes from "./AddTest.module.css";

const { Title, Text } = Typography;

const validateLeukocyteSum = (values) => {
  const neut = Number(values.neut || 0);
  const mono = Number(values.mono || 0);
  const eo = Number(values.eo || 0);
  const lymph = Number(values.lymph || 0);
  const baso = Number(values.baso || 0);
  const sum = neut + mono + eo + lymph + baso;
  return sum === 100;
};

const AddTest = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [showAdditional, setShowAdditional] = useState(false);

  const [handleMessage] = useMessage({
    successMsg: "Анализ успешно добавлен!",
    errorMsg: "Пожалуйста, исправьте ошибки в форме",
  });

  const onFinish = async (values) => {
    await handleMessage(async () => {
      await form.validateFields();

      // Преобразуем все строковые значения в числа перед отправкой
      const processedValues = formDataProcess(values);

      if (!validateLeukocyteSum(processedValues)) {
        throw new Error("Сумма лейкоцитов должна быть равна 100%");
      }

      const response = await SampleService.create_sample(processedValues);

      form.resetFields();
      setShowAdditional(false);
      navigate("/tests");
    });
  };

  const handleBack = () => {
    navigate("/tests");
  };

  return (
    <ConfigProvider theme={addTestTheme}>
      <div className={classes.container}>
        <MyButton className={classes.backButton} onClick={handleBack}>
          <BiArrowBack size={22} />
          Назад к анализам
        </MyButton>

        <Card className={classes.card}>
          <div className={classes.header}>
            <Title level={2} className={classes.title}>
              Добавить новый анализ крови
            </Title>
            <Text type="secondary">
              Заполните обязательные показатели ОАК и при необходимости добавьте
              биохимические показатели
            </Text>
          </div>

          <Divider />

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className={classes.form}
            validateTrigger={["onBlur", "onSubmit"]}
          >
            {/* Обязательные показатели */}
            <div className={classes.section}>
              <Title level={4} className={classes.sectionTitle}>
                Общий анализ крови (обязательно)
              </Title>
              <div className={classes.metricsGrid}>
                {requiredMetrics.map((metric) => (
                  <div key={metric.key} className={classes.formField}>
                    <Form.Item
                      name={metric.key}
                      label={metric.label}
                      rules={[
                        { required: true, message: "Обязательное поле" },
                        {
                          validator: (_, value) =>
                            validateField(value, metric.min, metric.max),
                        },
                      ]}
                    >
                      <Input
                        suffix={metric.units}
                        placeholder="0.00"
                        className={classes.input}
                        type="text"
                      />
                    </Form.Item>
                  </div>
                ))}
              </div>
            </div>

            <Divider />

            {/* Дополнительные показатели */}
            <div className={classes.section}>
              <div className={classes.sectionHeader}>
                <Title level={4} className={classes.sectionTitle}>
                  Биохимические показатели (опционально)
                </Title>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => setShowAdditional(!showAdditional)}
                  className={classes.toggleButton}
                >
                  {showAdditional ? "Скрыть" : "Показать"} дополнительные
                </Button>
              </div>

              {showAdditional && (
                <div className={classes.metricsGrid}>
                  {additionalMetrics.map((metric) => (
                    <div key={metric.key} className={classes.formField}>
                      <Form.Item
                        name={metric.key}
                        label={metric.label}
                        rules={[
                          {
                            validator: (_, value) =>
                              validateField(value, metric.min, metric.max),
                          },
                        ]}
                      >
                        <Input
                          suffix={metric.units}
                          placeholder="0.00"
                          className={classes.input}
                          inputMode="decimal"
                          type="text"
                        />
                      </Form.Item>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Divider />

            {/* Кнопки действий */}
            <Space size="large" className={classes.actions}>
              <MyButton className={classes.cancelButton} onClick={handleBack}>
                Отмена
              </MyButton>
              <MyButton className={classes.submitButton}>
                <SaveOutlined style={{ fontSize: "22px" }} />
                Сохранить анализ
              </MyButton>
            </Space>
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default AddTest;
