import { useState } from "react";
import { usePhoto } from "../usePhoto";
import { Popover, Tooltip, Avatar } from "antd";
import { Link } from "react-router";
import { LuUserRound } from "react-icons/lu";
import plural from "plural-ru";
import { PiSealCheckFill } from "react-icons/pi";
import { FaLocationDot } from "react-icons/fa6";
import { MdEditNote } from "react-icons/md";
import { calculateAge } from "../../../../utils/date";
import ConfirmEmail from "../ConfirmEmail/ConfirmEmail";
import classes from "./DoctorProfile.module.css";

export default function DoctorProfile({ profile }) {
  const photo = usePhoto(profile);
  const [hovered, setHovered] = useState(false);

  const handleHoverChange = (open) => {
    setHovered(open);
  };

  const longText = (
    <div className={classes.popoverContent}>
      <p>Мы проверили копию паспорта:</p>
      <ul>
        <li>— следы редактирования отсутствуют;</li>
        <li>— имя, фамилия и фото совпадают.</li>
      </ul>
    </div>
  );

  return (
    <div className={classes.doctorProfile}>
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
                  <img src={photo} className={classes.doctorPhoto} />
                </a>
              ) : (
                <Avatar
                  icon={<LuUserRound size={100} />}
                  className={classes.doctorPhoto}
                />
              )}
              <div className={classes.mainInfo}>
                <div className={classes.doctorName}>
                  <h2>
                    {profile.last_name} {profile.first_name}{" "}
                    {profile.middle_name}
                  </h2>
                  <p>Врач-специалист</p>
                </div>
                <div className={classes.doctorData}>
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
                    <p className={classes.doctorEmail}>{profile.email}</p>
                  </Tooltip>
                </div>
                <Popover
                  content={longText}
                  open={hovered}
                  onOpenChange={handleHoverChange}
                  trigger="hover"
                  arrow={false}
                  placement="bottomLeft"
                  mouseEnterDelay={0.2}
                >
                  <div
                    className={
                      hovered
                        ? `${classes.verification} ${classes.active}`
                        : classes.verification
                    }
                  >
                    <PiSealCheckFill
                      size={20}
                      className={
                        hovered
                          ? `${classes.checkIcon} ${classes.active}`
                          : classes.checkIcon
                      }
                    />
                    <p>Паспорт проверен</p>
                  </div>
                </Popover>
              </div>
            </div>
          </div>
          <div className={classes.statusBlocks}>
            <div className={classes.statusCard}>
              <FaLocationDot size={22} className={classes.statusIcon} />
              <p>
                {profile.place_employment}
                {profile.city && (
                  <>
                    , <br /> г. {profile.city}
                  </>
                )}
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
                <p className={classes.labelField}>Должность</p>
                <p>{profile.post}</p>
              </div>
              <div>
                <p className={classes.labelField}>Телефон</p>
                <p>{profile.phone || "Не указано"}</p>
              </div>
              <div>
                <p className={classes.labelField}>E-mail</p>
                <p>{profile.email}</p>
              </div>
            </div>
          </div>
          <h3 className={classes.sectionTitle}>О специалисте</h3>
          <div className={classes.sectionWrapper}>
            <div className={classes.contacts}>
              <div>
                <p className={classes.labelField}>Специализация</p>
                <p>{profile.specialization}</p>
              </div>
              <div>
                <p className={classes.labelField}>Стаж работы</p>
                {profile.experience
                  ? `${profile.experience} ${plural(profile.experience, "год", "года", "лет")}`
                  : "Не указано"}
              </div>
            </div>
          </div>
          <div className={classes.textSection}>
            <h3>Направления деятельности</h3>
            <p className={classes.longText}>{profile.bio || "Не указано"}</p>
          </div>
          <div className={classes.textSection}>
            <h3>Образование</h3>
            <p className={classes.longText}>
              {profile.education || "Не указано"}
            </p>
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
