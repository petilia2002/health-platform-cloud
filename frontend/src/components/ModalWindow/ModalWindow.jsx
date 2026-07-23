import MyModal from "../../UI/MyModal/MyModal";
import MySearch from "../../UI/MySearch/MySearch";
import MyButton from "../../UI/MyButton/MyButton";
import classes from "./ModalWindow.module.css";

export default function ModalWindow({
  modal,
  closeModal,
  handleSubmit,
  options,
  search,
  setSearch,
  errMsg,
  placeholder,
  formTitle,
  searchTitle,
  btnTitle,
  notFoundContent,
  searchClassName,
}) {
  return (
    <MyModal
      visible={modal}
      closeModal={closeModal}
      className={classes.formModal}
    >
      <h3 className={classes.formTitle}>{formTitle}</h3>
      <div className={classes.form}>
        <div className={classes.formGroup}>
          <p className={classes.searchLabel}>{searchTitle}</p>
          <MySearch
            className={searchClassName}
            placeholder={placeholder}
            options={options}
            value={search}
            onChange={(value) => setSearch(value)}
            listHeight={200}
            notFoundContent={notFoundContent}
            useSort={false}
          />
        </div>
        <MyButton className={classes.submitButton} onClick={handleSubmit}>
          {btnTitle}
        </MyButton>
      </div>
      <p
        className={
          errMsg ? `${classes.formError} ${classes.active}` : classes.formError
        }
      >
        {errMsg}
      </p>
    </MyModal>
  );
}
