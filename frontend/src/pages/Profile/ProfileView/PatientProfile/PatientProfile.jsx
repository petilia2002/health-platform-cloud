import { Link } from "react-router";
import { Tooltip, Avatar } from "antd";
import plural from "plural-ru";
import { usePhoto } from "../usePhoto";
import ConfirmEmail from "../ConfirmEmail/ConfirmEmail";
import { LuUserRound } from "react-icons/lu";
import { FaLocationDot } from "react-icons/fa6";
import { MdEditNote } from "react-icons/md";
import { calculateAge } from "../../../../utils/date";
import { formatDecimal } from "../../../../utils/parsing";
import classes from "./PatientProfile.module.css";

export default function PatientProfile({ profile }) {
  const photo = usePhoto(profile);

  return (
    <div className={classes.patientProfile}>
      <div className={classes.profileContainer}>
        <div className={classes.profileContent}>
          <div className={classes.profileCard}>
            <div className={classes.cardContent}>
              {photo ? (
                <a
                  href={photo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.photoLink}
                >
                  <img src={photo} className={classes.photo} />
                </a>
              ) : (
                <Avatar
                  icon={<LuUserRound size={100} />}
                  className={classes.avatar}
                />
              )}
              <div className={classes.mainInfo}>
                <div className={classes.userName}>
                  <h2>
                    {profile.last_name} {profile.first_name}{" "}
                    {profile.middle_name}
                  </h2>
                  <p>Пациент</p>
                </div>
                <div className={classes.userData}>
                  <p>
                    {calculateAge(profile.birth_date)}{" "}
                    {plural(
                      calculateAge(profile.birth_date),
                      "год",
                      "года",
                      "лет",
                    )}
                  </p>
                  {profile.city && <p>г. {profile.city}</p>}
                  <Tooltip title={profile.email}>
                    <p className={classes.email}>{profile.email}</p>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.statusBlocks}>
            <div className={classes.statusCard}>
              <FaLocationDot size={22} className={classes.statusIcon} />
              <p>
                Консультируется <br /> дистанционно
              </p>
            </div>
            <div className={classes.statusCard}>
              <ConfirmEmail profile={profile} />
            </div>
          </div>
          <h3 className={classes.sectionTitle}>Контакты</h3>
          <div className={classes.sectionWrapper}>
            <div className={classes.contacts}>
              <div>
                <p className={classes.labelField}>Телефон</p>
                <p>{profile.phone || "Не указано"}</p>
              </div>
              <div>
                <p className={classes.labelField}>E-mail</p>
                <p>{profile.email}</p>
              </div>
              <div>
                <p className={classes.labelField}>Город</p>
                <p>{profile.city || "Не указано"}</p>
              </div>
            </div>
          </div>
          <h3 className={classes.sectionTitle}>Медицинская карта</h3>
          <div className={classes.sectionWrapper}>
            <div className={classes.medCard}>
              <div>
                <p className={classes.labelField}>Пол</p>
                <p>{profile.gender}</p>
              </div>
              <div>
                <p className={classes.labelField}>Группа крови</p>
                <p>{profile.blood_type || "–"}</p>
              </div>
              <div>
                <p className={classes.labelField}>Рост</p>
                <p>{formatDecimal(profile.height, "см")}</p>
              </div>
              <div>
                <p className={classes.labelField}>Вес</p>
                <p>{formatDecimal(profile.weight, "кг")}</p>
              </div>
              <div>
                <p className={classes.labelField}>Индекс массы тела</p>
                <p>{formatDecimal(profile.bmi)}</p>
              </div>
            </div>
          </div>
        </div>
        <Link to="/profile/me/edit">
          <Tooltip title="Редактировать профиль">
            <MdEditNote size={34} className={classes.editIcon} />
          </Tooltip>
        </Link>
      </div>
    </div>
  );
}
