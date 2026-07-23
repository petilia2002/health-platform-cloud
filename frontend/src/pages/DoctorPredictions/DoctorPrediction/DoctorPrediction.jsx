import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Tooltip } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { FaUserEdit } from "react-icons/fa";
import { IoIosArrowDown, IoIosSearch } from "react-icons/io";
import { PiShareFat } from "react-icons/pi";
import { AiOutlineHeart } from "react-icons/ai";
import { TbDownload, TbSettings } from "react-icons/tb";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import {
  parseId,
  parseDate,
  parseTime,
  handleAnalyteName,
} from "../../../utils/parsing";
import clusteringImg from "../../../assets/clustering.png";
import dataScienceImg from "../../../assets/data_science.png";
import svmImg from "../../../assets/svm.png";
import MyButton from "../../../UI/MyButton/MyButton";
import PredTable from "../../../components/Prediction/PredTable/PredTable";
import classes from "./DoctorPrediction.module.css";

export default function DoctorPrediction({ patientId, prediction }) {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  const predictionIsPositive = prediction.results.find(
    (res) => res.conclusion === "positive"
  );
  const activeRequest = prediction.request?.status === "Активный";

  return (
    <div className={classes.predictionItem}>
      <div className={classes.mainContent}>
        <div className={classes.headerContent}>
          <div className={classes.header}>
            <p>
              Прогноз <strong>{parseId(prediction.id)}</strong> от{" "}
              <strong>{parseDate(prediction.creation_date)}</strong> в{" "}
              <strong>{parseTime(prediction.creation_date)}</strong>
            </p>
            {predictionIsPositive && (
              <Tooltip title="Возможно патология">
                <div className={classes.redCircle} />
              </Tooltip>
            )}
            {activeRequest && (
              <Tooltip title="Доступен для комментария">
                <FaUserEdit size={22} className={classes.editIcon} />
              </Tooltip>
            )}
          </div>
          <div className={classes.tagContainer}>
            {prediction.results.map((res) => (
              <div key={res.analyte_name} className={classes.tag}>
                {handleAnalyteName(res.analyte_name)}
              </div>
            ))}
          </div>
        </div>
        <div className={classes.imgContainer}>
          <img src={clusteringImg} />
          <img src={dataScienceImg} />
          <img src={svmImg} />
        </div>
      </div>
      <AnimatePresence initial={false}>
        {showDetails && (
          <motion.div
            key={"details"}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className={classes.details}
          >
            <PredTable
              className={classes.detailsTable}
              results={prediction.results}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className={classes.btnContainer}>
        <div className={classes.btnGrid}>
          <MyButton
            className={classes.predictionBtn}
            onClick={() => setShowDetails(!showDetails)}
          >
            <IoIosArrowDown
              size={22}
              className={
                showDetails
                  ? `${classes.detailsIcon} ${classes.active}`
                  : classes.detailsIcon
              }
            />
            {showDetails ? <p>Свернуть</p> : <p>Развернуть</p>}
          </MyButton>
          <MyButton
            className={classes.predictionBtn}
            onClick={() =>
              navigate(`/patients/${patientId}/predictions/${prediction.id}`)
            }
          >
            <IoIosSearch size={22} />
            <p>Посмотреть</p>
          </MyButton>
        </div>
      </div>
      <div className={classes.cardFooter}>
        <div className={classes.iconContainer}>
          <MdOutlineAddCircleOutline size={22} className={classes.myIcon} />
          <AiOutlineHeart size={22} className={classes.myIcon} />
          <TbSettings size={22} className={classes.myIcon} />
          <TbDownload size={22} className={classes.myIcon} />
          <PiShareFat size={22} className={classes.myIcon} />
        </div>
        <div className={classes.refContainer}>
          <Link
            to={`/patients/${patientId}/samples/${prediction.sample_id}`}
            className={classes.sampleRef}
          >
            перейти к анализу
          </Link>
          <BiArrowBack size={18} className={classes.refIcon} />
        </div>
      </div>
    </div>
  );
}
