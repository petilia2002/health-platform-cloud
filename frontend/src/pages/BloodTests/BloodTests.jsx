import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { IoIosAddCircleOutline } from "react-icons/io";
import { getExactDateAgo, toLocalISOString } from "../../utils/date";
import List from "../../components/List/List";
import TestCard from "../../components/TestCard/TestCard";
import SampleService from "../../services/SampleService";
import { useFetching } from "../../hooks/useFetching";
import { useSort } from "../../hooks/useSort";
import { useMessage } from "../../hooks/useMessage";
import Loader from "../../UI/Loader/Loader";
import MyButton from "../../UI/MyButton/MyButton";
import MySearch from "../../UI/MySearch/MySearch";
import EmptyList from "../../UI/EmptyList/EmptyList";
import classes from "./BloodTests.module.css";

const { RangePicker } = DatePicker;

export default function BloodTests() {
  const [samples, setSamples] = useState([]);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState({ field: "upload_date", order: "desc" });
  const [filter, setFilter] = useState({ period: "all", dates: null });

  const sortedSamples = useSort(samples, sort);

  const [fetching, isLoading] = useFetching(async (start_date, end_date) => {
    const response = await SampleService.get_samples(start_date, end_date);
    setSamples(response.data);
  });

  const [handleMessage] = useMessage({
    successMsg: "Анализ успешно удален!",
    errorMsg: "Что-то пошло не так...",
  });

  useEffect(() => {
    const start = searchParams.get("start_date");
    const end = searchParams.get("end_date");
    if (start && end) {
      setFilter({ period: "choose", dates: [dayjs(start), dayjs(end)] });
    } else {
      setFilter({ ...filter, dates: null });
    }
  }, []);

  useEffect(() => {
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");
    fetching(start_date, end_date);
  }, [searchParams]);

  const deleteSample = async (id) => {
    await handleMessage(async () => {
      await SampleService.delete_sample(id);
      setSamples(samples.filter((sample) => sample.id !== id));
    });
  };

  const changePeriod = (value) => {
    setFilter({ dates: null, period: value });

    if (value === "all") {
      setSearchParams({});
    } else if (value !== "choose") {
      setSearchParams({
        start_date: toLocalISOString(getExactDateAgo(value)),
        end_date: toLocalISOString(new Date()),
      });
    }
  };

  const handleDateChange = (values) => {
    setFilter((prev) => ({ ...prev, dates: values }));

    if (values) {
      setSearchParams({
        start_date: values[0].format("YYYY-MM-DD"),
        end_date: values[1].format("YYYY-MM-DD"),
      });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className={classes.tests}>
      <div className={classes.tests_header}>
        <div className={classes.tests_filter}>
          <div className={classes.sortSection}>
            <p className={classes.sortLabel}>Сортировать по:</p>
            <div className={classes.selectContainer}>
              <MySearch
                className={classes.testsSearch}
                placeholder={"Сортировать по:"}
                options={[
                  { value: "upload_date", label: "дате загрузки" },
                  { value: "update_date", label: "дате изменения" },
                ]}
                value={sort.field || null}
                onChange={(value) => setSort({ ...sort, field: value })}
                themes={{ fontSize: 18, optionFontSize: 18, controlHeight: 40 }}
                useSort={false}
              />
              <MySearch
                className={classes.testsSearch}
                placeholder={"Сортировать по:"}
                options={[
                  { value: "desc", label: "сначала новые" },
                  { value: "asc", label: "сначала старые" },
                ]}
                value={sort.order || null}
                onChange={(value) => setSort({ ...sort, order: value })}
                themes={{ fontSize: 18, optionFontSize: 18, controlHeight: 40 }}
                useSort={false}
              />
              <MyButton
                className={classes.testBtn}
                onClick={() => navigate("/tests/add")}
              >
                <IoIosAddCircleOutline className={classes.addIcon} /> Добавить
                анализ
              </MyButton>
            </div>
          </div>
          <div className={classes.filterSection}>
            <p className={classes.sortLabel}>Выбрать период:</p>
            <div className={classes.selectContainer}>
              <MySearch
                className={classes.testsSearch}
                placeholder={"Выберите период"}
                options={[
                  { value: "all", label: "За все время" },
                  { value: "week", label: "За неделю" },
                  { value: "month", label: "За месяц" },
                  { value: "year", label: "За год" },
                  { value: "choose", label: "Выбрать период" },
                ]}
                value={filter.period}
                onChange={changePeriod}
                themes={{ fontSize: 18, optionFontSize: 18, controlHeight: 40 }}
                useSort={false}
              />
              {filter.period === "choose" && (
                <RangePicker
                  placeholder={["Начало периода", "Конец периода"]}
                  className={classes.calendar}
                  onChange={handleDateChange}
                  value={filter.dates}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {isLoading ? (
        <Loader containerClassName={classes.testsLoader} />
      ) : (
        <List
          className={classes.tests_list}
          items={sortedSamples}
          renderItem={(bloodTest) => (
            <TestCard
              key={bloodTest.id}
              bloodTest={bloodTest}
              deleteSample={deleteSample}
            />
          )}
          renderEmptyList={() => (
            <EmptyList
              text="У вас пока нет анализов"
              containerClassName={classes.testsEmpty}
            />
          )}
        />
      )}
    </div>
  );
}
