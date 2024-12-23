import { FC } from "react";
import styles from "./expertCard.module.css";
import Button from "../Button/Button";

interface IExpertCard {
  image: string;
  title: string;
  name: string;
  profession: string;
  price: number;
  onClick:()=>void
}

const ExpertCard: FC<IExpertCard> = ({
  image,
  title,
  name,
  profession,
  price,
  onClick
}) => {
  return (
    <div className={styles["expert-card"]}>
      <div className={styles["expert-img"]}>
        <img src={image} alt="expert-img" />
      </div>
      <div className={styles["about-expert"]}>
        <span className={styles["title"]}>{title}</span>
        <span className={styles["name"]}>{name}</span>
        <span className={styles["profession"]}>{profession}</span>
      </div>
      <div className={styles["choose-block"]}>
        <span className={styles["price"]}>от {price} ₽/час</span>
        <Button
          className={styles["choose-btn"]}
          appearance="big"
          onClick={onClick}
        >
          <span>Выбрать услугу</span>
          <svg
            width="6"
            height="10"
            viewBox="0 0 6 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.539668 1.53244L3.72145 5.00447L0.539668 8.47651C0.21985 8.8255 0.21985 9.38926 0.539668 9.73826C0.859486 10.0872 1.37611 10.0872 1.69593 9.73826L5.45994 5.63087C5.77976 5.28188 5.77976 4.71812 5.45994 4.36913L1.69593 0.261745C1.37611 -0.0872478 0.859486 -0.0872478 0.539668 0.261745C0.228051 0.610739 0.21985 1.18344 0.539668 1.53244Z"
              fill="white"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default ExpertCard;
