import classes from "./Testimonials.module.css";

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className={`${classes.section} ${classes.testimonials}`}
    >
      <div className={classes.container}>
        <div className={classes.sectionTitle}>
          <h2>Отзывы наших пользователей</h2>
          <p>Что говорят пациенты и врачи о «Сервисе здоровья»</p>
        </div>
        <div className={classes.testimonialGrid}>
          <div className={classes.testimonialCard}>
            <div className={classes.testimonialContent}>
              <p>
                Благодаря «Сервису здоровья» я вовремя узнала о риске развития
                анемии. Прогноз системы подтвердил мой врач, и мы смогли начать
                лечение на ранней стадии.
              </p>
            </div>
            <div className={classes.testimonialAuthor}>
              <div className={classes.authorAvatar}>
                <img src="/patient-brunette.jpg" alt="Анна К." />
              </div>
              <div className={classes.authorInfo}>
                <h4>Анна К.</h4>
                <p>Пациент</p>
              </div>
            </div>
          </div>
          <div className={classes.testimonialCard}>
            <div className={classes.testimonialContent}>
              <p>
                Как врач-терапевт, я ценю точность прогнозов системы. Это
                отличный инструмент для первичной диагностики и мониторинга
                состояния пациентов.
              </p>
            </div>
            <div className={classes.testimonialAuthor}>
              <div className={classes.authorAvatar}>
                <img src="/doctor.jpg" alt="Дмитрий П." />
              </div>
              <div className={classes.authorInfo}>
                <h4>Дмитрий П.</h4>
                <p>Врач-терапевт</p>
              </div>
            </div>
          </div>
          <div className={classes.testimonialCard}>
            <div className={classes.testimonialContent}>
              <p>
                Удобный сервис для отслеживания динамики анализов. Особенно
                нравится возможность консультироваться с врачами, не выходя из
                дома.
              </p>
            </div>
            <div className={classes.testimonialAuthor}>
              <div className={classes.authorAvatar}>
                <img src="/patient-blonde.jpg" alt="Елена С." />
              </div>
              <div className={classes.authorInfo}>
                <h4>Елена С.</h4>
                <p>Пациент</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
