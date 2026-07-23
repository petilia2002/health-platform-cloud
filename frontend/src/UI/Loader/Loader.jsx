import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
import classes from "./Loader.module.css";

export default function Loader({
  containerClassName = "",
  loaderClassName = "",
}) {
  return (
    <Flex
      align="center"
      gap="middle"
      className={`${containerClassName} ${classes.loaderContainer}`}
    >
      <Spin
        indicator={
          <LoadingOutlined
            className={`${loaderClassName} ${classes.myLoader}`}
            spin
          />
        }
      />
    </Flex>
  );
}
