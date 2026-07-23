import { useState } from "react";

export const useModal = (callback, errMsg = "Произошла ошибка") => {
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (...args) => {
    if (!search) {
      setError(errMsg);
      return;
    }
    await callback(...args);
    closeModal();
  };

  const closeModal = () => {
    setSearch(null);
    setModal(false);
    setError(null);
  };

  return [
    modal,
    setModal,
    search,
    setSearch,
    error,
    setError,
    handleSubmit,
    closeModal,
  ];
};
