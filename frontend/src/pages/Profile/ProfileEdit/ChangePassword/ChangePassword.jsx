import { useState } from "react";
import { Form, Button, Input } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { PlusOutlined, UpOutlined } from "@ant-design/icons";
import classes from "./ChangePassword.module.css";

export default function ChangePassword() {
  const [isShow, setIsShow] = useState(false);
  const form = Form.useFormInstance();

  const validatePasswordPair = (rule, value) => {
    const curPassword = form.getFieldValue("cur_password");
    const newPassword = form.getFieldValue("new_password");

    if (!curPassword && !newPassword) {
      return Promise.resolve();
    }

    if ((curPassword && !newPassword) || (!curPassword && newPassword)) {
      return Promise.reject(
        new Error("Для смены пароля необходимо заполнить оба поля"),
      );
    }

    return Promise.resolve();
  };

  const animate = {
    initial: { height: 0, opacity: 0 },
    animate: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: {
      height: { duration: 0.5, ease: "easeInOut" },
      opacity: { duration: 0.5 },
    },
  };

  return (
    <div className={classes.changePass}>
      <Button
        type="dashed"
        icon={
          isShow ? (
            <UpOutlined style={{ fontSize: 16 }} />
          ) : (
            <PlusOutlined style={{ fontSize: 16 }} />
          )
        }
        className={classes.btnPass}
        onClick={() => setIsShow(!isShow)}
      >
        {isShow ? "Скрыть пароль" : "Сменить пароль"}
      </Button>
      <AnimatePresence initial={false}>
        {isShow && (
          <motion.div
            key="passwords"
            {...animate}
            className={classes.passwords}
          >
            <Form.Item
              className={classes.passwordItem}
              label="Текущий пароль"
              name="cur_password"
              validateFirst={true}
              validateTrigger={["onChange", "onBlur"]}
              dependencies={["new_password"]}
              rules={[
                { validator: validatePasswordPair },
                {
                  min: 4,
                  message: `Минимальная длина пароля 4 символа`,
                },
                {
                  max: 8,
                  message: `Максимальная длина пароля 8 символов`,
                },
                {
                  pattern: /^\S*$/,
                  message: "Пароль не должен содержать пробелов",
                },
              ]}
            >
              <Input.Password className={classes.passwordInput} />
            </Form.Item>
            <Form.Item
              className={classes.passwordItem}
              label="Новый пароль"
              name="new_password"
              validateFirst={true}
              validateTrigger={["onChange", "onBlur"]}
              rules={[
                {
                  min: 4,
                  message: `Минимальная длина пароля 4 символа`,
                },
                {
                  max: 8,
                  message: `Максимальная длина пароля 8 символов`,
                },
                {
                  pattern: /^\S*$/,
                  message: "Пароль не должен содержать пробелов",
                },
              ]}
            >
              <Input.Password className={classes.passwordInput} />
            </Form.Item>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
