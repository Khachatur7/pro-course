import { FC, useEffect, useState } from "react";
import Button from "../../Button/Button";
import InputLabel from "../../InputLabel/InputLabel";
import styles from "./OfferModale.module.css";
import Checkbox from "../../Checkbox/Checkbox";
import {
  changeOffer,
  createOffer,
  getOfferData,
  IOffer,
} from "../../../helpers/API";
import { useParams } from "react-router-dom";

interface IOfferModale {
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  upDateList: React.Dispatch<React.SetStateAction<boolean>>;
}

const OfferModale: FC<IOfferModale> = ({ setState, upDateList }) => {
  const { id } = useParams();
  const [changeData, setChangeData] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cardLink, setCardLink] = useState(
    "https://lk.pro-online.ru/testform/413"
  );
  const [cardCheckbox, setCardCheckbox] = useState(false);
  const [installmentLink, setInstallmentLink] = useState(
    "https://lk.pro-online.ru/testform/413"
  );
  const offerStorage = localStorage.getItem("offer");
  const [installmentCheckbox, setInstallmentCheckbox] = useState(false);
  const [message, setMessage] = useState<boolean | string>(false);
  const CheckPriceText = (e: string) => {
    setPrice(e.replace(/[^0-9]/g, ""));
  };

  const ChangeDataOrNot = async () => {
    if (offerStorage) {
      const offer = JSON.parse(offerStorage);
      getData(offer.courseId, offer.offerId);
      setChangeData(true);
    }
  };
  const CreateNewOffer = async () => {
    if (id) {
      try {
        const res = await createOffer(
          {
            tariff_name: name,
            price: price,
            in_credit: installmentCheckbox,
            credit_payment_link: installmentCheckbox ? installmentLink : null,
            payment_by_card: cardCheckbox,
            card_payment_link: cardCheckbox ? cardLink : null,
          },
          id?.toString()
        );
        setMessage(res.message);
        upDateList(true);
      } catch (error) {
        throw new Error("Не удалось создать новое предложение");
      }
    }
  };
  const ChangeOffer = async () => {
    if (id && offerStorage) {
      try {
        const ids = JSON.parse(offerStorage);
        await changeOffer(ids.courseId, ids.offerId, {
          tariff_name: name,
          price: price,
          in_credit: installmentCheckbox,
          credit_payment_link: installmentCheckbox ? installmentLink : null,
          payment_by_card: cardCheckbox,
          card_payment_link: cardCheckbox ? cardLink : null,
        });
        setMessage("Предложение изменено");
        upDateList(true);
        localStorage.removeItem("offer");
      } catch (error) {
        throw new Error("Не удалось изменить предложение");
      }
    }
  };

  const getData = async (courseId: string, offerId: string) => {
    if (courseId && offerId) {
      const res: IOffer = await getOfferData(courseId, offerId);
      setName(res.tariff_name);
      setPrice(res.price.toString());
      setCardLink(res.card_payment_link || "");
      setInstallmentLink(res.credit_payment_link || "");
      setCardCheckbox(res.payment_by_card);
      setInstallmentCheckbox(res.in_credit);
    }
  };

  useEffect(() => {
    ChangeDataOrNot();
  }, []);

  return (
    <div className={styles["offer"]}>
      <div className={styles["offer-modale"]}>
        <div className={styles["offer__top"]}>
          <span className={styles["offer-title"]}>
            {message
              ? message
              : changeData
              ? "Изменить предложение"
              : "Создание предложения"}
          </span>
          <div className={styles["exit_btn"]} onClick={() => setState(false)}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.0303 8.96967C9.73744 8.67678 9.26256 8.67678 8.96967 8.96967C8.67678 9.26256 8.67678 9.73744 8.96967 10.0303L10.9393 12L8.96969 13.9697C8.6768 14.2626 8.6768 14.7374 8.96969 15.0303C9.26258 15.3232 9.73746 15.3232 10.0303 15.0303L12 13.0607L13.9696 15.0303C14.2625 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2625 15.0303 13.9697L13.0606 12L15.0303 10.0303C15.3232 9.73746 15.3232 9.26258 15.0303 8.96969C14.7374 8.6768 14.2625 8.6768 13.9696 8.96969L12 10.9394L10.0303 8.96967Z"
                fill="#233566"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.0574 1.25H11.9426C9.63424 1.24999 7.82519 1.24998 6.41371 1.43975C4.96897 1.63399 3.82895 2.03933 2.93414 2.93414C2.03933 3.82895 1.63399 4.96897 1.43975 6.41371C1.24998 7.82519 1.24999 9.63422 1.25 11.9426V12.0574C1.24999 14.3658 1.24998 16.1748 1.43975 17.5863C1.63399 19.031 2.03933 20.1711 2.93414 21.0659C3.82895 21.9607 4.96897 22.366 6.41371 22.5603C7.82519 22.75 9.63423 22.75 11.9426 22.75H12.0574C14.3658 22.75 16.1748 22.75 17.5863 22.5603C19.031 22.366 20.1711 21.9607 21.0659 21.0659C21.9607 20.1711 22.366 19.031 22.5603 17.5863C22.75 16.1748 22.75 14.3658 22.75 12.0574V11.9426C22.75 9.63423 22.75 7.82519 22.5603 6.41371C22.366 4.96897 21.9607 3.82895 21.0659 2.93414C20.1711 2.03933 19.031 1.63399 17.5863 1.43975C16.1748 1.24998 14.3658 1.24999 12.0574 1.25ZM3.9948 3.9948C4.56445 3.42514 5.33517 3.09825 6.61358 2.92637C7.91356 2.75159 9.62177 2.75 12 2.75C14.3782 2.75 16.0864 2.75159 17.3864 2.92637C18.6648 3.09825 19.4355 3.42514 20.0052 3.9948C20.5749 4.56445 20.9018 5.33517 21.0736 6.61358C21.2484 7.91356 21.25 9.62177 21.25 12C21.25 14.3782 21.2484 16.0864 21.0736 17.3864C20.9018 18.6648 20.5749 19.4355 20.0052 20.0052C19.4355 20.5749 18.6648 20.9018 17.3864 21.0736C16.0864 21.2484 14.3782 21.25 12 21.25C9.62177 21.25 7.91356 21.2484 6.61358 21.0736C5.33517 20.9018 4.56445 20.5749 3.9948 20.0052C3.42514 19.4355 3.09825 18.6648 2.92637 17.3864C2.75159 16.0864 2.75 14.3782 2.75 12C2.75 9.62177 2.75159 7.91356 2.92637 6.61358C3.09825 5.33517 3.42514 4.56445 3.9948 3.9948Z"
                fill="#233566"
              />
            </svg>
          </div>
        </div>
        {!message ? (
          <form className={styles["form"]}>
            <InputLabel
              label="Название тарифа"
              type="text"
              id="tariff"
              value={name}
              onChange={(event) => setName(event.toString())}
            />
            <InputLabel
              label="Цена"
              type="text"
              id="price"
              value={price}
              onChange={(event) => CheckPriceText(event.toString())}
            />
            <div className={styles["payment-type"]}>
              <Checkbox
                label={"Оплата в рассрочку"}
                onChange={() => setInstallmentCheckbox(!installmentCheckbox)}
                active={installmentCheckbox}
              />
              {installmentCheckbox ? (
                <InputLabel
                  label="Ссылка на “Оплата в рассрочку”"
                  type="text"
                  id="link_one"
                  value={installmentLink}
                  onChange={(e) => setInstallmentLink(e.toString())}
                />
              ) : (
                ""
              )}
            </div>
            <div className={styles["payment-type"]}>
              <Checkbox
                label={"Оплата картой"}
                onChange={() => setCardCheckbox(!cardCheckbox)}
                active={cardCheckbox}
              />

              {cardCheckbox ? (
                <InputLabel
                  label="Ссылка на “Оплата картой”"
                  type="text"
                  id="link_one"
                  value={cardLink}
                  onChange={(e) => setCardLink(e.toString())}
                />
              ) : (
                ""
              )}
            </div>
            <div className={styles["form-nav"]}>
              <Button
                className={styles["form-btn"]}
                appearance="item"
                onClick={() => setState(false)}
              >
                Отменить
              </Button>
              <Button
                className={styles["form-btn"]}
                appearance="big"
                onClick={(e) => {
                  e.preventDefault();
                  changeData ? ChangeOffer() : CreateNewOffer();
                }}
              >
                {changeData ? "Изменить предложение" : "Создать предложение"}
              </Button>
            </div>
          </form>
        ) : (
          <div className={styles["created-message"]}>
            Предложение успешно {changeData ? "изменено" : "добавлено"}! Можете
            закрыть окно
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferModale;
