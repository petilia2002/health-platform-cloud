import { useState } from "react";

export const useFetching = (callback) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");

  const fetching = async (...args) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError("");
      await callback(...args);
    } catch (e) {
      const msg =
        e?.message ||
        "Что-то пошло не так. Пожалуйста, попробуйте еще раз позже...";
      setIsError(true);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return [fetching, isLoading, isError, error];
};
