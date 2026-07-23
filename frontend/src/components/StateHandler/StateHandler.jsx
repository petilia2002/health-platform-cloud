import Loader from "../../UI/Loader/Loader";
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage";
import classes from "./StateHandler.module.css";

export default function StateHandler({
  isLoading,
  isError,
  error,
  retryHandler,
  isValidId,
  message,
  children,
}) {
  if (isLoading) {
    return <Loader containerClassName={classes.loader} />;
  }

  if (!isValidId) {
    return (
      <ErrorMessage
        className={classes.error}
        message={message}
        retryHandler={retryHandler}
      />
    );
  }

  if (isError) {
    return (
      <ErrorMessage
        className={classes.error}
        message={error}
        retryHandler={retryHandler}
      />
    );
  }

  return children;
}
