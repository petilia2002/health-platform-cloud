import { Tooltip } from "antd";
import { useSelector } from "react-redux";
import { useMessage } from "../../../../hooks/useMessage";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";
import AuthService from "../../../../services/AuthService";
import classes from "./ConfirmEmail.module.css";

export default function ConfirmEmail({ profile }) {
  const { user } = useSelector((state) => state.auth);

  const [handleMessage] = useMessage({
    successMsg: "Письмо отправлено на почту!",
  });

  const emailConfirm = async () => {
    if (user.id === profile.id) {
      await handleMessage(async () => {
        await AuthService.confirm();
      });
    }
  };

  const getIsConfirm = () => {
    if (profile.is_activated) {
      return (
        <>
          <FaRegCircleCheck size={22} className={classes.confirmIcon} />
          <p>
            Учетная запись <br /> подтверждена
          </p>
        </>
      );
    } else {
      return (
        <>
          <IoCloseCircleOutline size={26} className={classes.confirmIcon} />
          {user.id === profile.id ? (
            <p>
              Учетная запись <br />{" "}
              <Tooltip title="Подтвердите почту" placement="bottom">
                <a onClick={emailConfirm} className={classes.confirmLink}>
                  не подтверждена
                </a>
              </Tooltip>
            </p>
          ) : (
            <p>
              Учетная запись <br /> не подтверждена
            </p>
          )}
        </>
      );
    }
  };

  return getIsConfirm();
}
