import { useState } from "react";
import { App, Empty, Typography, Button, Input } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { IoIosArrowDown } from "react-icons/io";
import PredictionService from "../../../services/PredictionService";
import { useMessage } from "../../../hooks/useMessage";
import CommentCard from "../CommentCard/CommentCard";
import classes from "./EditComment.module.css";

const { TextArea } = Input;

export default function EditComment({ patientId, prediction, setPrediction }) {
  const [commentShow, setCommentShow] = useState(false);
  const count = prediction?.doctor_comment ? 1 : 0;

  const [editMode, setEditMode] = useState(false);
  const [text, setText] = useState("");
  const { message } = App.useApp();

  const handleCommentShow = () => {
    if (commentShow) {
      setEditMode(false);
    }
    setCommentShow(!commentShow);
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const [handleEdit, editLoading] = useMessage({
    successMsg: "Комментарий успешно сохранен!",
  });

  const [handleDelete, deleteLoading] = useMessage({
    successMsg: "Комментарий успешно удален!",
  });

  const startEdit = () => {
    const startText = prediction?.doctor_comment || "";
    setEditMode(true);
    setText(startText);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setText("");
  };

  const onSave = async () => {
    if (!text.trim()) {
      message.error({
        content: "Комментарий не может быть пустым",
        duration: 2,
      });
      return;
    }
    await handleEdit(async () => {
      const response = await PredictionService.comment_prediction(
        patientId,
        prediction.id,
        text
      );
      setPrediction(response.data);
    });

    cancelEdit();
  };

  const onDelete = async () => {
    await handleDelete(async () => {
      const response = await PredictionService.delete_comment(
        patientId,
        prediction.id
      );
      setPrediction(response.data);
    });

    cancelEdit();
  };

  const renderComment = () => {
    if (editMode) {
      return (
        <div className={classes.editForm}>
          <TextArea
            onChange={handleChange}
            value={text}
            placeholder="Напишите разъяснение по прогнозу"
            showCount
            maxLength={1000}
            style={{ padding: "10px" }}
          />
          <div className={classes.formBtns}>
            <Button
              className={classes.formBtn}
              type="primary"
              onClick={onSave}
              loading={editLoading}
              disabled={!text.trim()}
            >
              Сохранить
            </Button>
            <Button
              className={classes.formBtn}
              type="default"
              onClick={cancelEdit}
            >
              Отмена
            </Button>
            <Button
              className={classes.formBtn}
              danger
              icon={<DeleteOutlined />}
              onClick={onDelete}
              loading={deleteLoading}
              disabled={!prediction?.doctor_comment}
            >
              Удалить
            </Button>
          </div>
        </div>
      );
    }

    if (prediction?.doctor_comment) {
      if (commentShow) {
        return <CommentCard prediction={prediction} startEdit={startEdit} />;
      } else {
        return null;
      }
    } else {
      if (commentShow) {
        return (
          <Empty
            description={
              <Typography.Text>Пока нет комментария от врача</Typography.Text>
            }
          >
            {prediction?.request?.status === "Активный" && (
              <Button
                type="primary"
                className={classes.emptyBtn}
                onClick={startEdit}
              >
                Добавить
              </Button>
            )}
          </Empty>
        );
      } else {
        return null;
      }
    }
  };

  return (
    <div className={classes.comment}>
      <div className={classes.titleSection}>
        <div className={classes.titleBtn} onClick={handleCommentShow}>
          <p className={classes.commentTitle}>Комментарий врача</p>
          <p className={classes.commentCount}>({count})</p>
          <IoIosArrowDown
            size={20}
            className={`${classes.arrowDown} ${
              commentShow ? classes.active : ""
            }`}
          />
        </div>
      </div>
      {renderComment()}
    </div>
  );
}
