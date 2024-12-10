import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useDispatch } from "react-redux";
import { resetAuth } from "../../features/auth/authSlice";
import { useState } from "react";
import cn from "classnames";

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const [isPromoHidden, setIsPromoHidden] = useState(false);

  const handlePromoClosed = () => {
    setIsPromoHidden(true);
  };

  const handleLogout = () => {
    dispatch(resetAuth());
    window.location.href = "/login";
  };

  const sections = {
    courses: ["/", "/settings"],
    marketplaces: [
      "/marketplaces",
      "/marketplaces/services",
      "/marketplaces/templates",
    ],
  };

  const isActiveSection = (paths: string[]) =>
    paths.some((path) => location.pathname.startsWith(path));

  return (
    <div className={styles["sidebar"]}>
      <div className={styles["sidebar-box"]}>
        <ul className={styles["menu"]}>
          <li>
            <NavLink
              to="/"
              className={cn({
                [styles["active"]]: isActiveSection(sections.courses),
              })}
            >
              <img src="/sidebar-icon.svg" alt="" />
              Курсы
            </NavLink>
          </li>
        </ul>
      </div>
      <div className={styles["sidebar-box"]}>
        <ul className={styles["menu"]}>
          <li>
            <NavLink
              to="/marketplaces/services"
              className={cn({
                [styles["active"]]: isActiveSection(sections.marketplaces),
              })}
            >
              <img src="/sidebar-icon.svg" alt="" />
              Маркетплейс услуг
            </NavLink>
          </li>
        </ul>
      </div>
      <div
        className={cn(styles["promo"], { [styles["hidden"]]: isPromoHidden })}
      >
        <div className={styles["promo__top"]}>
          <NavLink to={"/"} className={styles["promo__img"]}>
            <img src="/promo-img.png" alt="" />
          </NavLink>
          <button
            className={styles["promo-closed"]}
            onClick={handlePromoClosed}
          >
            <span>Скрыть</span>
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.68754 6.47945C6.49228 6.28419 6.17569 6.28419 5.98043 6.47945C5.78517 6.67471 5.78517 6.9913 5.98043 7.18654L7.29354 8.49967L5.98044 9.81281C5.78518 10.0081 5.78518 10.3246 5.98044 10.5199C6.1757 10.7151 6.49229 10.7151 6.68754 10.5199L8.00067 9.20681L9.31374 10.5199C9.509 10.7151 9.8256 10.7151 10.0209 10.5199C10.2161 10.3246 10.2161 10.008 10.0209 9.81281L8.70774 8.49967L10.0209 7.18654C10.2161 6.99131 10.2161 6.67473 10.0209 6.47947C9.8256 6.28421 9.509 6.28421 9.31374 6.47947L8.00067 7.79261L6.68754 6.47945Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.03892 1.33301H7.96238C6.42348 1.333 5.21744 1.33299 4.27646 1.45951C3.3133 1.589 2.55328 1.85923 1.95674 2.45577C1.3602 3.05231 1.08998 3.81232 0.960484 4.77548C0.833971 5.71647 0.833978 6.92249 0.833984 8.46141V8.53794C0.833978 10.0769 0.833971 11.2829 0.960484 12.2239C1.08998 13.187 1.3602 13.9471 1.95674 14.5436C2.55328 15.1401 3.3133 15.4103 4.27646 15.5399C5.21744 15.6663 6.42347 15.6663 7.96238 15.6663H8.03892C9.57785 15.6663 10.7839 15.6663 11.7249 15.5399C12.688 15.4103 13.4481 15.1401 14.0446 14.5436C14.6411 13.9471 14.9113 13.187 15.0409 12.2239C15.1673 11.2829 15.1673 10.0769 15.1673 8.53794V8.46141C15.1673 6.92249 15.1673 5.71647 15.0409 4.77548C14.9113 3.81232 14.6411 3.05231 14.0446 2.45577C13.4481 1.85923 12.688 1.589 11.7249 1.45951C10.7839 1.33299 9.57785 1.333 8.03892 1.33301ZM2.66385 3.16287C3.04362 2.7831 3.55743 2.56517 4.4097 2.45059C5.27636 2.33407 6.41516 2.33301 8.00065 2.33301C9.58612 2.33301 10.7249 2.33407 11.5916 2.45059C12.4439 2.56517 12.9577 2.7831 13.3375 3.16287C13.7172 3.54264 13.9352 4.05645 14.0497 4.90873C14.1663 5.77538 14.1673 6.91419 14.1673 8.49967C14.1673 10.0851 14.1663 11.2239 14.0497 12.0906C13.9352 12.9429 13.7172 13.4567 13.3375 13.8365C12.9577 14.2163 12.4439 14.4342 11.5916 14.5487C10.7249 14.6653 9.58612 14.6663 8.00065 14.6663C6.41516 14.6663 5.27636 14.6653 4.4097 14.5487C3.55743 14.4342 3.04362 14.2163 2.66385 13.8365C2.28408 13.4567 2.06615 12.9429 1.95156 12.0906C1.83504 11.2239 1.83398 10.0851 1.83398 8.49967C1.83398 6.91419 1.83504 5.77538 1.95156 4.90873C2.06615 4.05645 2.28408 3.54264 2.66385 3.16287Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
        <div className={styles["promo__desc"]}>
          -15% на все шаблоны до конца сентября!{" "}
          <NavLink to={"/"}>Подробнее</NavLink>
        </div>
      </div>
      <button className={styles["exit"]} onClick={handleLogout}>
        <img src="/exit.svg" alt="" />
        выйти
      </button>
    </div>
  );
};
