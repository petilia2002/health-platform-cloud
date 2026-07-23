import classes from "./MyError.module.css";

export default function MyError({
  containerClassName,
  errorClassName,
  message,
}) {
  return (
    <div className={`${containerClassName} ${classes.errorContainer}`}>
      <p className={`${errorClassName} ${classes.msgError}`}>{message}</p>
    </div>
  );
}
