import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { App, Modal, Button, Upload, Image, Avatar } from "antd";
import ImgCrop from "antd-img-crop";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { LuUserRound } from "react-icons/lu";
import { updateUserPhoto } from "../../store/authSlice";
import UserService from "../../services/UserService";
import { useAuth } from "../../hooks/useAuth";
import { useMessage } from "../../hooks/useMessage";
import classes from "./UploadPhoto.module.css";

export default function UploadPhoto({ isModalOpen, setIsModalOpen }) {
  const [previewImage, setPreviewImage] = useState(null); // предварительное фото перед отправкой на сервер
  const [avatarFile, setAvatarFile] = useState(null); // само фото для отправки на сервер
  const [avatarUrl, setAvatarUrl] = useState(null); // ссылка на текущее фото (для синхронизациии с redux-store)

  const dispatch = useDispatch();
  const { user } = useAuth();
  const { message } = App.useApp();

  // Для синхронизации стора и локального состояния
  useEffect(() => {
    if (user?.photo_url) {
      setAvatarUrl(user.photo_url);
    }
  }, [user?.photo_url]);

  const [handleSaveMessage, isUploading] = useMessage({
    successMsg: "Фото успешно загружено!",
  });

  const [handleDeleteMessage] = useMessage({
    successMsg: "Фото успешно удалено",
  });

  // Обработчик закрытия модалки
  const handleCancel = () => {
    setIsModalOpen(false);
    setPreviewImage(null);
    setAvatarFile(null);
  };

  // Обработчик после кроппинга
  const handleCropComplete = (file) => {
    // file уже обрезан и готов к загрузке
    setAvatarFile(file);

    // Обновляем preview с обрезанным изображением
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Обработчик выбора файла
  const handleFileChange = (info) => {
    if (info.file.status === "removed") {
      setAvatarFile(null);
      setPreviewImage(null);
    }
  };

  const handleSaveAvatar = async () => {
    if (!avatarFile) {
      message.warning("Выберите файл для загрузки");
      return;
    }

    await handleSaveMessage(async () => {
      const formData = new FormData();
      formData.append("photo", avatarFile);

      const response = await UserService.update_photo(formData);
      const { photo_url, icon_url } = response.data;

      dispatch(updateUserPhoto({ photo_url, icon_url }));

      setIsModalOpen(false);
      setAvatarFile(null);
      setPreviewImage(null);
      setAvatarUrl(photo_url);
    });
  };

  const handleDeleteAvatar = async () => {
    if (!avatarUrl) {
      message.error("Нет загруженного фото");
      return;
    }

    await handleDeleteMessage(async () => {
      await UserService.delete_photo();

      dispatch(updateUserPhoto({ photo_url: null, icon_url: null }));

      setAvatarFile(null);
      setPreviewImage(null);
      setAvatarUrl(null);
    });
  };

  const uploadProps = {
    name: "photo", // поле photo в form-data
    accept: "image/*", // любые изображения (jpg, png, gif, webp и т.д.)
    maxCount: 1, // можно загружать только одно изображение
    onChange: handleFileChange, // обработчик выбора фото, удаления, изменения статуса и т.д.
    fileList: avatarFile
      ? [
          {
            uid: "-1",
            name: avatarFile.name,
            status: "done",
            originFileObj: avatarFile,
          },
        ]
      : [], // массив файлов, которые отображаются в Upload
    showUploadList: {
      showRemoveIcon: true, // показывать иконку удаления (✕)
    },

    customRequest: ({ file, onSuccess }) => {
      // Немного «асинхронности», чтобы Upload отработал корректно
      setTimeout(() => {
        if (onSuccess) onSuccess("ok"); // помечаем как успешное завершение
      }, 0);
      // возвращаем объект с abort, если кто-то захочет отменить — не обязательно
      return { abort() {} };
    },
  };

  // Настройки для ImgCrop
  const imgCropProps = {
    quality: 1, // Качество сжатия (от 0 до 1)
    fillColor: "transparent", // Цвет фона
    modalTitle: "Обрезка фото", // Заголовок модалки кроппинга
    modalWidth: 600, // Ширина модалки
    modalOk: "Применить", // Текст кнопки OK
    modalCancel: "Отмена", // Текст кнопки отмены

    // Формат вывода (квадратное изображение для аватара)
    shape: "round", // 'rect' | 'round' - круглая обрезка для аватара

    // Пропорции обрезки (квадрат 1:1)
    aspect: 1,

    // Минимальный и максимальный зум
    zoom: true,
    minZoom: 1,
    maxZoom: 3,

    // Вращение
    rotate: true,

    // Разрешения
    resolution: {
      minWidth: 100,
      minHeight: 100,
      maxWidth: 2000,
      maxHeight: 2000,
    },

    // Обработчик перед кроппингом
    beforeCrop: (file) => {
      if (file.type === "image/gif") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result); // анимированная dataURL — останется анимация
          setAvatarFile(file);
        };
        reader.readAsDataURL(file);

        message.info(
          "GIF-фото не обрезается в браузере и будет загружено как есть"
        );
        return false; // отменяем модалку кропа
      }

      // Дополнительная валидация перед кроппингом
      const isImage = file.type.startsWith("image/");
      const isLt5M = file.size / 1024 / 1024 < 5; // меньше 5MB

      if (!isImage) {
        message.error("Можно загружать только изображения!");
        return false;
      }

      if (!isLt5M) {
        message.error("Изображение должно быть меньше 5MB для обработки!");
        return false;
      }

      return true;
    },

    // Когда кроппинг завершен
    onModalOk: (file) => {
      handleCropComplete(file);
    },

    // Когда кроппинг отменен
    onModalCancel: () => {
      if (avatarFile) {
        // Возвращаем preview к оригинальному файлу
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(avatarFile);
      }
    },
  };

  return (
    <Modal
      title="Выберите фото для загрузки"
      centered
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" type="default" onClick={handleCancel}>
          Отмена
        </Button>,
        <Button
          key="delete"
          danger
          icon={<DeleteOutlined />}
          onClick={handleDeleteAvatar}
          disabled={!avatarUrl}
        >
          Удалить
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={isUploading}
          onClick={handleSaveAvatar}
          disabled={!avatarFile}
        >
          Сохранить
        </Button>,
      ]}
    >
      <div className={classes.modalContent}>
        <div className={classes.preview}>
          {previewImage ? (
            <Image
              src={previewImage}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Avatar src={avatarUrl} size={150} icon={<LuUserRound />} />
          )}
        </div>
        <ImgCrop rotationSlider {...imgCropProps}>
          <Upload {...uploadProps} className={classes.myUpload}>
            <Button icon={<UploadOutlined />}>Выбрать файл</Button>
          </Upload>
        </ImgCrop>
        <div className={classes.uploadHint}>
          Поддерживаемые форматы: JPG, PNG, GIF. Максимальный размер: 2MB
        </div>
      </div>
    </Modal>
  );
}
