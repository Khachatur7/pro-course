import { FC } from "react";
import styles from "./serviceCard.module.css";
import Button from "../Button/Button";

interface IServiceCard {
  name: string;
  price: number;
  onClick : () => void
}

const ServiceCard: FC<IServiceCard> = ({ name, price,onClick }) => {
  return (
    <div className={styles["service-card"]}>
      <div className={styles['title']}>
        <span>{name}</span>
      </div>
      <div className={styles["price"]}>
        {" "}
        <span>от {price} <span>₽</span>/час</span>
      </div>
      <Button  appearance="item" onClick={onClick}>
        <span>Выбрать</span>
      </Button>
    </div>
  );
};

export default ServiceCard;
