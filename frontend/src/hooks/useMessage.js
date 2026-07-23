import React, { useState } from "react";
import { App } from "antd";

export const useMessage = (options = {}) => {
  const {
    loadingMsg = "Пожалуйста, подождите...",
    successMsg = "Операция прошла успешно!",
    errorMsg = "Произошла ошибка",
  } = options;

  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const handleMessage = async (cb, ...args) => {
    if (loading) {
      console.log("Операция уже выполняется");
      return;
    }
    setLoading(true);

    const key = "processing";
    message.loading({
      content: React.createElement(
        "span",
        { style: { fontFamily: '"Montserrat", sans-serif', fontWeight: 500 } },
        loadingMsg,
      ),
      key,
      duration: 0,
    });
    try {
      setLoading(true);

      await cb(...args);

      message.success({
        content: React.createElement(
          "span",
          {
            style: { fontFamily: '"Montserrat", sans-serif', fontWeight: 500 },
          },
          successMsg,
        ),
        key,
        duration: 3,
      });
    } catch (e) {
      const msg = typeof e === "string" ? e : e?.message || errorMsg;
      message.error({
        content: React.createElement(
          "span",
          {
            style: { fontFamily: '"Montserrat", sans-serif', fontWeight: 500 },
          },
          msg,
        ),
        key,
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  return [handleMessage, loading];
};
