import classes from "./MyTable.module.css";

export default function MyTable({ columns, data, className = "" }) {
  return (
    <div className={`${className} ${classes.myTable}`} tabIndex={0}>
      <table className={classes.tableContent}>
        <thead>
          <tr className={classes.headerRow}>
            {columns.map((column) => (
              <th key={column.index} className={classes.tableHeaderCell}>
                {column.element}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.key} className={classes.tableRow}>
              <td className={`${row.className} ${classes.tableCell}`}>
                <span>{row.analyte}</span>
              </td>
              <td className={`${row.className} ${classes.tableCell}`}>
                <span>{row.probability}</span>
              </td>
              <td className={`${row.className} ${classes.tableCell}`}>
                <span>{row.conclusion}</span>
              </td>
              <td className={`${row.className} ${classes.tableCell}`}>
                <span>{row.disease}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
