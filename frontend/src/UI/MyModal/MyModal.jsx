import classes from "./MyModal.module.css";

export default function MyModal({ children, className, visible, closeModal }) {
  const cls = visible
    ? [classes.modal, classes.active].join(" ")
    : classes.modal;

  return (
    <div className={cls} onClick={() => closeModal()}>
      <div
        className={`${classes.modal__content} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <span className={classes.close} onClick={() => closeModal()}>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
}
