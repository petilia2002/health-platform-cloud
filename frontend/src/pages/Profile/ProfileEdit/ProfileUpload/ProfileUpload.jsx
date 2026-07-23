import { useState, useEffect } from "react";
import { Form, Button, Upload, Avatar, Image, App, Tooltip } from "antd";
import ImgCrop from "antd-img-crop";
import { UploadOutlined, ReloadOutlined } from "@ant-design/icons";
import { LuUserRound } from "react-icons/lu";
import { useAuth } from "../../../../hooks/useAuth";
import FileService from "../../../../utils/FileService";
import Loader from "../../../../UI/Loader/Loader";
import classes from "./ProfileUpload.module.css";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default function ProfileUpload() {
  const form = Form.useFormInstance();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const photo = user?.photo_url;

  const photoField = Form.useWatch("photo", form);
  const fileList = photoField || [];

  const { message } = App.useApp();

  const initPhoto = async () => {
    if (photo) {
      try {
        setIsLoading(true);
        const [file, fileName] = await FileService.loadFileByUrl(photo);
        const fileListEntry = {
          uid: "-1",
          name: fileName,
          status: "done",
          originFileObj: file,
        };

        // Обновляем поле формы
        form.setFieldsValue({ photo: [fileListEntry] });

        // Генерируем preview
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);
      } catch (e) {
        console.error("Failed to load initial photo:", e);
        message.error("Не удалось загрузить фото профиля");
      } finally {
        setIsLoading(false);
      }
    } else {
      form.setFieldsValue({ photo: [] });
    }
  };

  useEffect(() => {
    initPhoto();
  }, [photo]);

  // Обработчик после кроппинга
  const handleCropComplete = (file) => {
    // Создаём объект для fileList
    const fileListEntry = {
      uid: "-1",
      name: file.name,
      status: "done",
      originFileObj: file,
    };

    // Обновляем поле формы
    form.setFieldsValue({ photo: [fileListEntry] });

    // Генерируем preview
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  // Обработчик удаления файла
  const handleFileChange = (info) => {
    if (info.file.status === "removed") {
      setPreviewUrl(null);
      form.setFieldsValue({ photo: [] });
    }
  };

  const handleModalCancel = () => {
    // При отмене кропа возвращаем preview к ранее выбранному файлу
    const currentFileList = form.getFieldValue("photo");
    if (currentFileList?.length > 0) {
      const file = currentFileList[0].originFileObj;
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const uploadProps = {
    name: "photo",
    accept: "image/*",
    maxCount: 1,
    fileList,
    onChange: handleFileChange, // обработчик удаления фото
    showUploadList: { showRemoveIcon: true },
    customRequest: ({ file, onSuccess }) => {
      setTimeout(() => onSuccess("ok"), 0);
      return { abort() {} };
    },
  };

  // Настройки для ImgCrop
  const imgCropProps = {
    quality: 1,
    fillColor: "transparent",
    modalTitle: "Обрезка фото",
    modalWidth: 600,
    modalOk: "Применить",
    modalCancel: "Отмена",
    shape: "round",
    aspect: 1,
    zoom: true,
    minZoom: 1,
    maxZoom: 3,
    rotate: true,
    resolution: {
      minWidth: 100,
      minHeight: 100,
      maxWidth: 2000,
      maxHeight: 2000,
    },
    beforeCrop: (file) => {
      if (file.type === "image/gif") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
          const fileListEntry = {
            uid: "-1",
            name: file.name,
            status: "done",
            originFileObj: file,
          };
          form.setFieldsValue({ photo: [fileListEntry] });
        };
        reader.readAsDataURL(file);
        message.info("GIF-фото не обрезается и будет загружено как есть");
        return false;
      }

      const isImage = file.type.startsWith("image/");
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isImage) {
        message.error("Можно загружать только изображения!");
        return false;
      }
      if (!isLt5M) {
        message.error("Изображение должно быть меньше 5MB!");
        return false;
      }
      return true;
    },
    onModalOk: handleCropComplete,
    onModalCancel: handleModalCancel,
  };

  return (
    <div className={classes.photoSection}>
      <div className={classes.photoContainer}>
        {isLoading ? (
          <Loader />
        ) : previewUrl ? (
          <Image
            src={previewUrl}
            style={{
              width: 180,
              height: 180,
              objectFit: "cover",
            }}
          />
        ) : (
          <Avatar icon={<LuUserRound size={100} />} className={classes.photo} />
        )}
      </div>
      <Form.Item
        className={classes.buttonItem}
        key="photo"
        name="photo"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <ImgCrop rotationSlider {...imgCropProps}>
          <Upload {...uploadProps} className={classes.myUpload}>
            <Button icon={<UploadOutlined />} className={classes.uploadButton}>
              Выбрать файл
            </Button>
          </Upload>
        </ImgCrop>
      </Form.Item>
      {!previewUrl && photo && (
        <Tooltip title="Вернуть исходное">
          <Button
            icon={<ReloadOutlined style={{ fontSize: 16 }} />}
            onClick={initPhoto}
          />
        </Tooltip>
      )}
    </div>
  );
}
