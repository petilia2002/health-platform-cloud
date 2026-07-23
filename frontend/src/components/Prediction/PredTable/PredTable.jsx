import { SiSpeedtest } from "react-icons/si";
import { IoStatsChart } from "react-icons/io5";
import { FaRegNoteSticky } from "react-icons/fa6";
import { FaNotesMedical } from "react-icons/fa";
import { analyteDiseaseMap } from "../../../constants/prediction";
import { handleAnalyteName } from "../../../utils/parsing";
import MyTable from "../../../UI/MyTable/MyTable";
import classes from "./PredTable.module.css";

const tableColumns = [
  {
    key: 1,
    index: "analyte",
    element: (
      <div className={classes.tableHeader}>
        <SiSpeedtest size={17} />
        <p>Показатель</p>
      </div>
    ),
  },
  {
    key: 2,
    index: "probability",
    element: (
      <div className={classes.tableHeader}>
        <IoStatsChart size={17} />
        <p>Вероятность</p>
      </div>
    ),
  },
  {
    key: 3,
    index: "conclusion",
    element: (
      <div className={classes.tableHeader}>
        <FaRegNoteSticky size={17} />
        <p>Заключение</p>
      </div>
    ),
  },
  {
    key: 4,
    index: "disease",
    element: (
      <div className={classes.tableHeader}>
        <FaNotesMedical size={17} />
        <p>Возможное заболевание</p>
      </div>
    ),
  },
];

export default function PredTable({ results, className = "" }) {
  const tableData = results.map((res, index) => ({
    key: index + 1,
    analyte: handleAnalyteName(res.analyte_name),
    probability: res.probability.toFixed(4),
    conclusion:
      res.conclusion === "positive" ? "Положительное" : "Отрицательное",
    disease: analyteDiseaseMap[res.analyte_view_name],
    className:
      res.conclusion === "positive"
        ? `${classes.tableCell} ${classes.patology}`
        : classes.tableCell,
  }));

  return (
    <MyTable columns={tableColumns} data={tableData} className={className} />
  );
}
