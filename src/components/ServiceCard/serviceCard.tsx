import { FC } from "react";
import styles from "./serviceCard.module.css";

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
      <button className={styles["btn"]} onClick={onClick}>
        <span>Выбрать</span>
      </button>
    </div>
  );
};

export default ServiceCard;
