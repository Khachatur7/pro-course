import { FC, useEffect, useState } from "react";
import styles from "./OffersList.module.css";
import { getOffers, IOffer } from "../../../helpers/API";
import { useParams } from "react-router-dom";
import OfferModale from "../OfferModale/OfferModale";
import OfferCard from "../OfferCard/OfferCard";

interface IOfferList {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

const OffersList: FC<IOfferList> = ({ state, setState }) => {
  const [offersList, setOffersList] = useState<IOffer[]>([]);
  const [upDate, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const GetUsers = async () => {
    if (id) {
      try {
        const res = await getOffers(id);
        console.log(res);
        setOffersList(res);
        setUpdate(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (upDate) {
      GetUsers();
    }
  }, [upDate]);

  useEffect(() => {
    GetUsers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (offersList.length == 0) {
        setLoading(false);
      }
    }, 2000);
    if (loading && offersList.length != 0) {
      setLoading(false);
    }

    return () => {
      clearTimeout(timer);
      console.log("Таймер остановлен!");
    };
  }, [offersList]);
  if (loading) {
    return (
      <div className={styles["loading"]}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="120"
          height="30"
          viewBox="0 0 120 30"
          fill="#0050ff"
        >
          <circle cx="15" cy="15" r="12">
            <animate
              attributeName="r"
              from="12"
              to="12"
              begin="0s"
              dur="0.8s"
              values="12;9;12"
              calcMode="linear"
              repeatCount="indefinite"
            />
            <animate
              attributeName="fill-opacity"
              from="1"
              to="1"
              begin="0s"
              dur="0.8s"
              values="1;.5;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="60" cy="15" r="9" fillOpacity="0.5">
            <animate
              attributeName="r"
              from="9"
              to="9"
              begin="0.2s"
              dur="0.8s"
              values="9;12;9"
              calcMode="linear"
              repeatCount="indefinite"
            />
            <animate
              attributeName="fill-opacity"
              from="0.5"
              to="0.5"
              begin="0.2s"
              dur="0.8s"
              values=".5;1;.5"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="105" cy="15" r="9" fillOpacity="0.5">
            <animate
              attributeName="r"
              from="9"
              to="9"
              begin="0.4s"
              dur="0.8s"
              values="9;12;9"
              calcMode="linear"
              repeatCount="indefinite"
            />
            <animate
              attributeName="fill-opacity"
              from="0.5"
              to="0.5"
              begin="0.4s"
              dur="0.8s"
              values=".5;1;.5"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    );
  }
  if (offersList.length == 0 && !loading) {
    return (
      <span>
        Нету предложений
        {state && <OfferModale setState={setState} upDateList={setUpdate} />}
      </span>
    );
  }
  return (
    <div className={styles["offer"]}>
      {state && <OfferModale setState={setState} upDateList={setUpdate} />}

      <div className={styles["offer__top"]}>
        <div className={styles["name"]}>
          <span>Название</span>
        </div>
        <div className={styles["price"]}>
          {" "}
          <span>Цена</span>{" "}
        </div>
        <div className={styles["link"]}>
          {" "}
          <span>Ссылка</span>{" "}
        </div>
      </div>
      <div className={styles["offer__list"]}>
        {offersList &&
          offersList.map((of) => {
            return (
              <OfferCard
                key={of.id}
                name={of.tariff_name}
                price={of.price}
                courseId={of.course_id}
                offerId={of.id}
                upDateList={setUpdate}
                setState={setState}
              />
            );
          })}
      </div>
    </div>
  );
};

export default OffersList;
