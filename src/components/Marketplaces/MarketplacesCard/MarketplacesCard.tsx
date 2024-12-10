import { useNavigate } from "react-router-dom";
import Button from "../../Button/Button";
import styles from "./MarketplacesCard.module.css";

interface MarketplacesCardProps {
  id: number;
  image: string;
  name: string;
  title: string;
  services: IService[];
  additionalServices?: number;
  price: number;
}

interface IService {
  id: number;
  name: string;
  price: number;
  orders_count: number;
  reorders_count: number;
  reviews_count: null;
}

const MarketplaceCard: React.FC<MarketplacesCardProps> = ({
  id,
  image,
  name,
  title,
  services,
  additionalServices,
  price,
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles["card"]}>
      <div className={styles["card-top"]}>
        <div className={styles["top"]}>
          <div className={styles["img"]}>
            <img src={image} alt={name} />
          </div>
          <div className={styles["top-info"]}>
            <div className={styles["title"]}>{title}</div>
            <div className={styles["name"]}>
              {" "}
              <span>{name}</span>
            </div>
          </div>
        </div>
        <div className={styles["services"]}>
          {services.slice(0, 3).map((serv, index) => (
            <div key={index} className={styles["services-items"]}>
              {serv.name}
            </div>
          ))}
          {additionalServices && (
            <div
              className={styles["card-move"]}
              onClick={() => {
                navigate(`/expert/${id}`);
                localStorage.setItem("more-services", JSON.stringify(true));
              }}
            >
              ещё{" "}
              <span>
                {additionalServices - 3}{" "}
                {additionalServices - 3 == 1
                  ? "услуга"
                  : additionalServices - 3 == 2 ||
                    additionalServices - 3 == 3 ||
                    additionalServices - 3 == 4
                  ? "услуги"
                  : "услуг"}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className={styles["card-bottom"]}>
        <div className={styles["price"]}>от {price} ₽/час</div>
        <Button
          className={styles["btn"]}
          appearance="big"
          onClick={() => navigate(`/expert/${id}`)}
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

export default MarketplaceCard;
