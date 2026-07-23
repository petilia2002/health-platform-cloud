import { useNavigate } from "react-router";
import { FaRegTrashAlt } from "react-icons/fa";
import plural from "plural-ru";
import { GrView } from "react-icons/gr";
import testImage from "../../assets/bloodTest.png";
import MyButton from "../../UI/MyButton/MyButton";
import { convertUTCToLocal } from "../../utils/date";
import DateFormatter from "../../utils/DateFormatter";
import { getCategoryColor, METRIC_CATEGORIES, getAnalysisTags } from "./index";
import classes from "./TestCard.module.css";

// CSS-цвета для тегов
const colorClasses = {
  blue: classes.tag_blue,
  green: classes.tag_green,
  yellow: classes.tag_yellow,
  orange: classes.tag_orange,
  purple: classes.tag_purple,
};

const hasBiochemicalMarkers = (results) => {
  return results.some((res) => METRIC_CATEGORIES["БИОХИМИЯ"].includes(res));
};

export default function TestCard({ bloodTest, deleteSample }) {
  const results = bloodTest.results.map((res) => res.analyte_view_name);

  const tags = getAnalysisTags(results);
  const isContainBioParameters = hasBiochemicalMarkers(results);
  const totalMetricsCount = results.length;
  const formattedDate = DateFormatter.format(
    convertUTCToLocal(bloodTest.upload_date),
  );
  const hasMid = results.some((res) => res === "mid");

  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/tests/${id}`);
  };

  return (
    <div className={classes.testCard}>
      <div className={classes.card_content}>
        <div className={classes.about_container}>
          <h3 className={classes.card_icon}>
            {isContainBioParameters ? "🧪" : "💉"}
          </h3>
          <div className={classes.test_about}>
            <h3 className={classes.card_title}>
              {isContainBioParameters
                ? "Комплексный анализ крови"
                : "Общий (клинический) анализ крови"}
            </h3>
            <div className={classes.card_info}>
              <p>Загружено {formattedDate}</p>
              <p className={classes.card_dot}>•</p>
              <p>
                {totalMetricsCount}{" "}
                {plural(
                  totalMetricsCount,
                  "показатель",
                  "показателя",
                  "показателей",
                )}
              </p>
            </div>
            <div className={classes.tags_container}>
              {!isContainBioParameters && (
                <>
                  <div
                    className={`${classes.card_tag} ${classes.tag_blue} ${classes.oak_tag}`}
                  >
                    {totalMetricsCount}{" "}
                    {plural(
                      totalMetricsCount,
                      "показатель",
                      "показателя",
                      "показателей",
                    )}{" "}
                    {"ОАК"}
                  </div>
                  <div
                    className={`${classes.card_tag} ${classes.tag_green} ${classes.oak_tag}`}
                  >
                    {hasMid ? "3 популяции" : "5 популяций"} лейкоцитов
                  </div>
                </>
              )}
              {isContainBioParameters &&
                tags.map((item) => (
                  <div
                    key={item.id}
                    className={`${classes.card_tag} ${
                      colorClasses[getCategoryColor(item.name)]
                    }`}
                  >
                    {item.name}
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className={classes.imgContainer}>
          <img className={classes.card_img} src={testImage} />
        </div>
      </div>
      <div className={classes.btns_container}>
        <MyButton
          className={classes.testBtn}
          onClick={() => handleView(bloodTest.id)}
        >
          <GrView size={18} />
          Просмотреть
        </MyButton>
        <MyButton
          className={classes.testBtn}
          onClick={() => deleteSample(bloodTest.id)}
        >
          <FaRegTrashAlt size={18} />
          <p>Удалить</p>
        </MyButton>
      </div>
    </div>
  );
}
