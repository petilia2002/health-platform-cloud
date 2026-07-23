import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { TiDocumentDelete } from "react-icons/ti";
import { IoIosArrowDown, IoIosSearch } from "react-icons/io";
import { PiShareFat } from "react-icons/pi";
import { AiOutlineHeart } from "react-icons/ai";
import { TbDownload, TbSettings } from "react-icons/tb";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import { convertUTCToLocal } from "../../../utils/date";
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
import PredTable from "../PredTable/PredTable";
import classes from "./PredictionItem.module.css";

export default function PredictionItem({ prediction, deletePrediction }) {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  const predictionIsPositive = prediction.results.find(
    (res) => res.conclusion === "positive",
  );

  return (
    <div className={classes.predictionItem}>
      <div className={classes.mainContent}>
        <div className={classes.headerContent}>
          <div className={classes.header}>
            <p>
              Прогноз <strong>{parseId(prediction.id)}</strong> от{" "}
              <strong>
                {parseDate(convertUTCToLocal(prediction.creation_date))}
              </strong>{" "}
              в{" "}
              <strong>
                {parseTime(convertUTCToLocal(prediction.creation_date))}
              </strong>
            </p>
            {predictionIsPositive && <div className={classes.redCircle} />}
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
            {predictionIsPositive && (
              <div className={classes.recom}>
                <p className={classes.recomText}>
                  Рекомендована консультация <Link to="/doctors">врача</Link>
                </p>
              </div>
            )}
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
            onClick={() => navigate(`/forecasts/${prediction.id}`)}
          >
            <IoIosSearch size={22} />
            <p>Посмотреть</p>
          </MyButton>
          <MyButton
            className={classes.predictionBtn}
            onClick={() => deletePrediction(prediction.id)}
          >
            <TiDocumentDelete size={22} />
            <p>Удалить</p>
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
            to={`/tests/${prediction.sample_id}`}
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
