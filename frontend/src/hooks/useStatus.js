import { useNotification } from "./useNotification";

export const useStatus = () => {
  const [notifyResubmit] = useNotification({
    successMsg: "Заявка успешно отправлена!",
    errorMsg: "При отправке заявки произошла ошибка",
  });

  const [notifyComplete] = useNotification({
    successMsg: "Консультация успешно завершена!",
    errorMsg: "При попытке завершить консультацию произошла ошибка",
  });

  const [notifyCancel] = useNotification({
    successMsg: "Заявка успешно отменена!",
    errorMsg: "В процессе отмены заявки произошла ошибка",
  });

  return [notifyResubmit, notifyComplete, notifyCancel];
};
