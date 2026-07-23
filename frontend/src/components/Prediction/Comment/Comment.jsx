import { useState } from "react";
import { Empty, Typography, Button } from "antd";
import { IoIosArrowDown } from "react-icons/io";
import { convertUTCToLocal, formatDateTime } from "../../../utils/date";
import userSvg from "../../../assets/user.svg";
import classes from "./Comment.module.css";

const COMMENT_LENGTH = 200;

export default function Comment({
  access,
  doctor,
  comment,
  comment_date,
  setModal,
}) {
  const [commentShow, setCommentShow] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const count = comment ? 1 : 0;

  return (
    <div className={classes.comment}>
      <div className={classes.titleSection}>
        <div
          className={classes.titleBtn}
          onClick={() => setCommentShow(!commentShow)}
        >
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
      {comment
        ? commentShow && (
            <div className={classes.commentSection}>
              <div className={classes.commentCard}>
                <div className={classes.commentHeader}>
                  <a href={doctor.icon} target="_blank">
                    <img src={doctor.icon || userSvg} />
                  </a>
                  <div className={classes.doctorInfo}>
                    <h5>
                      {doctor.last_name} {doctor.first_name}{" "}
                      {doctor.middle_name}
                    </h5>
                    <p>{doctor.post}</p>
                  </div>
                </div>
                <div className={classes.commentContent}>
                  <p
                    className={`${classes.commentText} ${
                      expanded || comment.length <= COMMENT_LENGTH
                        ? classes.expanded
                        : classes.collapsed
                    }`}
                  >
                    {comment}
                  </p>
                  {comment.length > COMMENT_LENGTH && (
                    <button
                      className={classes.toggleBtn}
                      onClick={() => setExpanded((s) => !s)}
                      aria-expanded={expanded}
                    >
                      {expanded ? "Свернуть" : "Показать полностью"}
                    </button>
                  )}
                </div>
                <div className={classes.commentFooter}>
                  <p>{formatDateTime(convertUTCToLocal(comment_date))}</p>
                </div>
              </div>
            </div>
          )
        : commentShow && (
            <Empty
              description={
                <Typography.Text>Пока нет комментария от врача</Typography.Text>
              }
            >
              {access?.status === "Активный" ? (
                <div className={classes.emptyMark}>Запрос отправлен</div>
              ) : (
                <Button
                  type="primary"
                  className={classes.emptyBtn}
                  onClick={() => setModal(true)}
                >
                  Запросить
                </Button>
              )}
            </Empty>
          )}
    </div>
  );
}
