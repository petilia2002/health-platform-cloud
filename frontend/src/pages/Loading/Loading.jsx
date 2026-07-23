import { Spin } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import classes from "./Loading.module.css";

export default function Loading() {
  return (
    <div className={classes.waveSpinContainer}>
      <div className={classes.spinCenter}>
        <Spin
          indicator={<SyncOutlined className={classes.waveIcon} spin={true} />}
          size="large"
        />
        <p className={classes.waveText}>Пожалуйста, подождите...</p>
      </div>
    </div>
  );
}
