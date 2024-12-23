import { FC } from "react";
import styles from "./PaymentType.module.css";

interface IPaymentType {
  active: boolean;
  type: string;
  onChange: () => void;
}

const PaymentType: FC<IPaymentType> = ({ active, onChange,type }) => {
  return (
    <div className={styles["payment"]} onClick={onChange}>
      <div className={styles["radio"]}>
        <input type="radio" onChange={onChange} checked={active} />
        <span className={`${active && styles["active_text"]}`}>
          Оплата {type}
        </span>
      </div>
      {active && (
        <div className={styles["cards"]}>
          <img src="/visa.png" alt="" />
          <img src="/master-card.png" alt="" />
          <img src="/world.png" alt="" />
        </div>
      )}
    </div>
  );
};

export default PaymentType;
