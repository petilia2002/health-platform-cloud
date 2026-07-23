import classes from "./Steps.module.css";

export default function Steps() {
  return (
    <section id="how-it-works" className={classes.section}>
      <div className={classes.container}>
        <div className={classes.sectionTitle}>
          <h2>Как это работает</h2>
          <p>Всего 4 простых шага к пониманию состояния вашего здоровья</p>
        </div>
        <div className={classes.steps}>
          <div className={classes.step}>
            <div className={classes.stepNumber}>1</div>
            <div className={classes.stepContent}>
              <h3>Загрузите свои анализы</h3>
              <p>
                Введите результаты общего и биохимического анализов крови через
                удобный интерфейс. Система автоматически проверит корректность
                введенных данных.
              </p>
            </div>
          </div>
          <div className={classes.step}>
            <div className={classes.stepNumber}>2</div>
            <div className={classes.stepContent}>
              <h3>Получите прогноз</h3>
              <p>
                Наша нейронная сеть проанализирует показатели и сгенерирует
                прогноз по четырем ключевым параметрам: ферритин, гликированный
                гемоглобин, липопротеины низкой плотности и мочевая кислота.
              </p>
            </div>
          </div>
          <div className={classes.step}>
            <div className={classes.stepNumber}>3</div>
            <div className={classes.stepContent}>
              <h3>Консультация с врачом</h3>
              <p>
                При необходимости вы можете отправить запрос на консультацию к
                врачу платформы для профессиональной оценки результатов.
              </p>
            </div>
          </div>
          <div className={classes.step}>
            <div className={classes.stepNumber}>4</div>
            <div className={classes.stepContent}>
              <h3>Мониторинг здоровья</h3>
              <p>
                Отслеживайте динамику своих показателей, получайте рекомендации
                и сохраняйте историю всех анализов в одном месте.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
