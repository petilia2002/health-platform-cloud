import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Form, Button, ConfigProvider } from "antd";
import ProfileUpload from "../ProfileUpload/ProfileUpload.jsx";
import ProfileInput from "../ProfileInput/ProfileInput.jsx";
import { validatorMap } from "../validators.js";
import { useProfile, getFormInitial, transformToFormData } from "../types.js";
import UserService from "../../../../services/UserService.js";
import { updateUserPhoto } from "../../../../store/authSlice.js";
import { useMessage } from "../../../../hooks/useMessage.js";
import ChangePassword from "../ChangePassword/ChangePassword.jsx";
import { theme } from "../themes.js";
import classes from "./EditForm.module.css";

export default function EditForm({ profile }) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(profile);

  const [handleMessage] = useMessage({
    successMsg: "Данные сохранены",
  });

  const getRules = (attr) => {
    const validatorsCb = validatorMap[attr.name];
    return validatorsCb(attr);
  };

  const onFinish = async (values) => {
    const formData = transformToFormData(values);
    console.log(values);

    await handleMessage(async () => {
      const response = await UserService.update_profile(formData);
      const { photo: photo_url, icon: icon_url } = response.data;
      dispatch(updateUserPhoto({ photo_url, icon_url }));
    });
  };

  const goBack = () => navigate("/profile/me");

  const fields = useProfile(profile?.role);

  const getClassName = (attr) => {
    if (attr.type === "textarea" || attr.type === "radio") {
      return classes.fullWidth;
    } else {
      return classes.halfWidth;
    }
  };

  const renderProfile = () => {
    if (!profile) return;
    return (
      <div className={classes.profileEdit}>
        <Form
          className={classes.editForm}
          form={form}
          layout="vertical"
          initialValues={getFormInitial(profile)}
          validateTrigger={["onBlur", "onSubmit"]}
          onFinish={onFinish}
        >
          <ProfileUpload />
          <div className={classes.formGrid}>
            {fields.map((attr) => (
              <Form.Item
                key={attr.name}
                label={attr.label}
                name={attr.name}
                rules={getRules(attr)}
                className={getClassName(attr)}
              >
                <ProfileInput attr={attr} />
              </Form.Item>
            ))}
          </div>
          <ChangePassword />
          <div className={classes.formButtons}>
            <Form.Item className={classes.buttonItem}>
              <Button
                type="primary"
                htmlType="submit"
                className={classes.saveBtn}
              >
                Сохранить
              </Button>
            </Form.Item>
            <Form.Item className={classes.buttonItem}>
              <Button
                type="default"
                className={classes.saveBtn}
                onClick={goBack}
              >
                Отменить
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  };

  return <ConfigProvider theme={theme}>{renderProfile()}</ConfigProvider>;
}
