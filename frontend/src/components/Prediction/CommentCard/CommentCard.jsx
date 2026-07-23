import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { convertUTCToLocal, formatDateTime } from "../../../utils/date";
import classes from "./CommentCard.module.css";

const COMMENT_LENGTH = 200;

export default function CommentCard({ prediction, startEdit }) {
  const [expanded, setExpanded] = useState(false);

  const doctor = prediction?.doctor;
  const comment = prediction?.doctor_comment;
  const commentDate = prediction?.comment_date;
  const isCommentEdit = prediction?.request?.status === "Активный";

  return (
    <div className={classes.commentSection}>
      <div className={classes.commentCard}>
        <div className={classes.commentHeader}>
          <a href={doctor.icon} target="_blank">
            <img src={doctor.icon} />
          </a>
          <div className={classes.doctorInfo}>
            <h5>
              {doctor.last_name} {doctor.first_name} {doctor.middle_name}
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
          <p>{formatDateTime(convertUTCToLocal(commentDate))}</p>
        </div>
        {isCommentEdit && (
          <div className={classes.iconSection}>
            <MdEdit
              size={18}
              className={classes.editIcon}
              onClick={startEdit}
            />
          </div>
        )}
      </div>
    </div>
  );
}
