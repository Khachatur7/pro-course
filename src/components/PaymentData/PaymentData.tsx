import { FC, useState } from "react";
import styles from "./PaymentData.module.css";
import InputLabel from "../InputLabel/InputLabel";
import Button from "../Button/Button";
import Checkbox from "../Checkbox/Checkbox";
import PaymentType from "../PaymentType/PaymentType";
import { NavLink } from "react-router-dom";
import { IOffer } from "../../helpers/API";

interface IPayment {
  offerInfo: IOffer;
  error: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
}

const PaymentData: FC<IPayment> = ({ offerInfo, error, setError }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [paymetType, setPaymentType] = useState(
    offerInfo.payment_by_card ? "картой" : "в рассрочку"
  );
  const [paymentLink, setPaymentLink] = useState(
    offerInfo.payment_by_card
      ? offerInfo.card_payment_link
      : offerInfo.credit_payment_link
  );
  const [agreement, setAgreement] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (text: string) => {
    setEmail(text);
  };

  const BuyOffer = () => {
    if (!name || phone.length < 18 || !emailRegex.test(email) || !agreement) {
      setError(true);
    } else {
      error && setError(false);
      location.replace(paymentLink || location.pathname);
    }
  };

  const ChangePaymentType = (newType: string) => {
    if (newType != paymetType) {
      setPaymentType(newType);
      if (offerInfo.card_payment_link == paymentLink) {
        setPaymentLink(offerInfo.credit_payment_link);
      } else {
        setPaymentLink(offerInfo.card_payment_link);
      }
    }
  };

  console.log(offerInfo);

  return (
    <div className="data-component__list">
      <div className={styles["data-component"]}>
        <div className={styles["title"]}>
          <span>Данные заказа</span>
        </div>
        <div className={styles["data_list"]}>
          <div className={styles["data__item"]}>
            <div className={styles["data_title"]}>Номер заказа</div>
            <div className={styles["data"]}>№{offerInfo.id}</div>
          </div>
          <div className={styles["data__item"]}>
            <div className={styles["data_title"]}>Состав заказа</div>
            <div className={styles["data"]}>{offerInfo.tariff_name}</div>
          </div>
          <div className={styles["data__item"]}>
            <div className={styles["data_title"]}>Сумма к оплате</div>
            <div className={styles["data"]}>{offerInfo.price} ₽</div>
          </div>
        </div>
      </div>
      <div className={styles["data-component"]}>
        <div className={styles["title"]}>
          <span>Данные покупателя</span>
        </div>

        <div className={styles["customer-data"]}>
          <InputLabel
            label="(*) Имя"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.toString())}
          />
          <div className={styles["error"]}>
            <span>{error && !name && "напишите ваше имя"}</span>
          </div>
          <InputLabel
            label="(*) Контактный телефон"
            type="input"
            id="phone"
            mask="+7 (999) 999-99-99"
            hideClearButton
            value={phone}
            onChange={(e) => setPhone(e.toString())}
          />
          <div className={styles["error"]}>
            <span>{error && phone.length < 18 && "напишите ваш номер"}</span>
          </div>
          <InputLabel
            label="Электронная почта"
            type="email"
            id="email"
            value={email}
            onChange={(e) => handleChange(e.toString())}
          />
          <div className={styles["error"]}>
            <span>
              {error &&
                !emailRegex.test(email) &&
                "напишите вашу электронную почту"}
            </span>
          </div>
        </div>
      </div>
      <div className={styles["data-component"]}>
        <div className={styles["title"]}>
          <span>Выберите способ оплаты</span>
        </div>
        <div className={styles["payment-type"]}>
          <div className={styles["types-radio"]}>
            <PaymentType
              active={paymetType == "картой"}
              type={"картой"}
              onChange={() =>
                offerInfo.payment_by_card && ChangePaymentType("картой")
              }
            />
            <PaymentType
              active={paymetType == "в рассрочку"}
              type={"в рассрочку"}
              onChange={() =>
                offerInfo.in_credit && ChangePaymentType("в рассрочку")
              }
            />
          </div>
          <Checkbox
            onChange={() => setAgreement(!agreement)}
            className={styles["checkbox"]}
          >
            <span className={styles["agreement"]}>
              Я согласен(a) с{" "}
              <NavLink to="/privacy-policy">публичной офертой</NavLink> и{" "}
              <NavLink to="/privacy-policy">
                {" "}
                Политикой обработки персональных данных
              </NavLink>{" "}
              и даю <NavLink to="/privacy-policy">согласие</NavLink> на их
              обработку.
            </span>
          </Checkbox>
          <div className={styles["error"]}>
            <span>{error && !agreement && "нужно согласие"}</span>
          </div>

          <Button
            className={styles["pay-btn"]}
            appearance="big"
            onClick={BuyOffer}
          >
            Оплатить заказ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentData;
