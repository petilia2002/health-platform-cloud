import React, { useState } from "react";
import { App, Spin, Flex } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export const useNotification = (options = {}) => {
  const {
    loadingMsg = "Пожалуйста, подождите...",
    successMsg = "Операция прошла успешно!",
    errorMsg = "Произошла ошибка",
  } = options;

  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleNotification = async (cb, ...args) => {
    if (loading) {
      console.log("Подождите, обработаваем текущий запрос!");
      return;
    }

    setLoading(true);
    const key = "processing";

    notification.open({
      key,
      message: "Ожидание",
      description: loadingMsg,
      duration: 0,
      icon: React.createElement(
        Flex,
        { align: "center", gap: "middle" },
        React.createElement(Spin, {
          indicator: React.createElement(LoadingOutlined, { spin: true }),
          size: "medium",
        }),
      ),
    });

    try {
      setServerError(null);
      await cb(...args);

      notification.destroy(key);
      notification.success({
        message: "Отлично",
        description: successMsg,
        duration: 3,
      });
    } catch (e) {
      const msg = typeof e === "string" ? e : e?.message || errorMsg;
      console.log(msg);
      setServerError(msg);
      notification.destroy(key);
      notification.error({
        message: "Ошибка",
        description: msg,
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  return [handleNotification, loading, serverError, setServerError];
};
