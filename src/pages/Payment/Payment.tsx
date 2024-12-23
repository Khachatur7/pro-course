import { NavLink, useParams } from "react-router-dom";
import styles from "./Payment.module.css";
import PaymentData from "../../components/PaymentData/PaymentData";
import { getOfferData, IOffer } from "../../helpers/API";
import { useEffect, useState } from "react";

const Payment = () => {
  const { curseId, offerId } = useParams();
  const [data, setData] = useState<IOffer | null>(null);
  const [error, setError] = useState(false);

  const getData = async () => {
    if (curseId && offerId) {
      const res = await getOfferData(curseId, offerId);
      setData(res);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles["payment-page"]}>
      <header className={styles["payment__header"]}>
        <img src="/logo.svg" alt="logo" />
      </header>
      {data && (
        <main className={styles["payment-main"]}>
          <div className={styles["title"]}>
            {" "}
            <span>Оплата заказа</span>
          </div>
          <PaymentData
            error={error}
            setError={setError}
            offerInfo={data}
          />
          <div className={styles["main-bottom"]}>
            <div className={styles["cards"]}>
              <img src="/visa.svg" alt="" />
              <img src="/master-card.svg" alt="" />
              <img src="/world.svg" alt="" />
            </div>
            <span>
              Интернет-платежи защищены сертификатом SSL и протоколом 3D Secure.
              Мы не передаём никому платёжные данные, в том числе данные карты
            </span>
            <span>
              При возникновении проблем с оплатой перейдите в раздел Помощь или
              обратитесь в Службу поддержки
            </span>
          </div>
        </main>
      )}
      <footer className={styles["footer"]}>
        <div className={styles["wrapper"]}>
          <div className={styles["footer__wrap"]}>
            <div className={styles["menu"]}>
              <NavLink to="/privacy-policy">
                Политика конфиденциальности
              </NavLink>
              <a href="/instruktsiya.pdf" target="_blank">
                Инструкция
              </a>
              <NavLink to="/privacy-policy">Карта сайта</NavLink>
            </div>
            <div className={styles["develop"]}>
              <a href="https://ag-group.tech/" target="_blank">
                Разработано в "AG-Group"
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Payment;
