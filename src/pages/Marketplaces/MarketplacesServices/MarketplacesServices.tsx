import Input from "../../../components/Input/Input";
import Headling from "../../../components/Headling/Headling";
import styles from "./MarketplacesServices.module.css";
import MarketplaceList from "../../../components/Marketplaces/MarketplacesList/MarketplacesList";
import { useEffect, useRef, useState } from "react";
import {
  filterExpertsByName,
  getExperts,
  sortExpertsByDecrease,
  sortExpertsByIncrease,
} from "../../../helpers/API";

interface IExpert {
  id: number;
  name: string;
  lastname: string;
  middle_name: string;
  description: string;
  photo: string;
  specialization: string;
  services_count: number;
  services_list: IService[];
}

interface IService {
  id: number;
  name: string;
  price: number;
  orders_count: number;
  reorders_count: number;
  reviews_count: null;
}

const MarketplacesServices = () => {
  const [services, setServices] = useState<IExpert[]>([]);
  const [notFound, setNotFound] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeSort, setActiveSort] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [firstItem, setFirstItem] = useState("по умолчанию");
  const [secondItem, setSecondItem] = useState("цена по возрастанию");
  const [thirdItem, setThirdItem] = useState("цена по убыванию");

  const GetUsers = async (
    setState?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    try {
      const res = await getExperts();

      setServices(res.data);
      if (setState) {
        setFirstItem("по умолчанию");
        setState(firstItem);
        setActiveSort(!activeSort);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const searchUser = async () => {
    if (!inputRef.current?.value.trim()) {
      return GetUsers();
    } else {
      try {
        const res = await filterExpertsByName(inputRef.current?.value.trim());

        if (res.data.length > 0) {
          setServices(res.data);
          setNotFound(false);
        } else {
          setServices([]);
          setNotFound(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const SortByIncrease = async (
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    try {
      const res = await sortExpertsByIncrease();

      setServices(res.data);
      setFirstItem("цена по возрастанию");
      setState(firstItem);
      setActiveSort(!activeSort);
    } catch (error) {
      console.log(error);
    }
  };

  const SortByDecrease = async (
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    try {
      const res = await sortExpertsByDecrease();
      setServices(res.data);
      setFirstItem("цена по убыванию");
      setState(firstItem);
      setActiveSort(!activeSort);
    } catch (error) {
      console.log(error);
    }
  };

  const SortByWhat = (
    text: string,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (text == "по умолчанию") {
      GetUsers(setState);
    } else if (text == "цена по возрастанию") {
      SortByIncrease(setState);
    } else if (text == "цена по убыванию") {
      SortByDecrease(setState);
    }
  };

  useEffect(() => {
    GetUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setActiveSort(false);
      }
    };

    if (activeSort) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeSort]);

  return (
    <div className={styles["page"]}>
      <Headling appearance="big">Маркетплейс услуг</Headling>
      <div className={styles["search"]}>
        <Input
          className={styles["search-input"]}
          type="text"
          name="search"
          placeholder="Введите имя специалиста"
          ref={inputRef}
        />
        <button className={styles["search-btn"]} onClick={searchUser}>
          <span>Найти</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.8229 12.9729L12.1288 11.2847C13.0472 10.1501 13.4952 8.70628 13.3805 7.25105C13.2657 5.79582 12.5969 4.4401 11.512 3.46345C10.4271 2.4868 9.00883 1.96368 7.54958 2.00196C6.09034 2.04025 4.70141 2.63702 3.66922 3.66922C2.63702 4.70141 2.04025 6.09034 2.00196 7.54958C1.96368 9.00883 2.4868 10.4271 3.46345 11.512C4.4401 12.5969 5.79582 13.2657 7.25105 13.3805C8.70628 13.4952 10.1501 13.0472 11.2847 12.1288L12.9729 13.8229C13.0285 13.879 13.0947 13.9236 13.1677 13.954C13.2406 13.9844 13.3189 14 13.3979 14C13.4769 14 13.5552 13.9844 13.6281 13.954C13.7011 13.9236 13.7673 13.879 13.8229 13.8229C13.879 13.7673 13.9236 13.7011 13.954 13.6281C13.9844 13.5552 14 13.4769 14 13.3979C14 13.3189 13.9844 13.2406 13.954 13.1677C13.9236 13.0947 13.879 13.0285 13.8229 12.9729ZM3.22101 7.71081C3.22101 6.82281 3.48433 5.95475 3.97768 5.21641C4.47102 4.47807 5.17223 3.9026 5.99264 3.56278C6.81304 3.22295 7.71579 3.13404 8.58673 3.30728C9.45766 3.48052 10.2577 3.90813 10.8856 4.53604C11.5135 5.16395 11.9411 5.96396 12.1143 6.83489C12.2876 7.70583 12.1987 8.60858 11.8588 9.42898C11.519 10.2494 10.9436 10.9506 10.2052 11.4439C9.46687 11.9373 8.59881 12.2006 7.71081 12.2006C6.52004 12.2006 5.37804 11.7276 4.53604 10.8856C3.69404 10.0436 3.22101 8.90158 3.22101 7.71081Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
      {services.length > 0 && (
        <div className={styles["service-header"]}>
          <span className={styles["service-count"]}>
            {services.length}{" "}
            {services.length == 1
              ? "услуга"
              : services.length == 2 ||
                services.length == 3 ||
                services.length == 4
              ? "услуги"
              : "услуг"}
          </span>

          <div className={styles["sort-block"]} ref={sortRef}>
            <button
              className={styles["sort-by-btn"]}
              onClick={() => setActiveSort(!activeSort)}
            >
              <span>{firstItem}</span>
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.46756 0.539912L4.99553 3.72169L1.52349 0.539912C1.1745 0.220094 0.610738 0.220094 0.261745 0.539912C-0.0872483 0.85973 -0.0872483 1.37636 0.261745 1.69618L4.36913 5.46019C4.71812 5.78 5.28188 5.78 5.63087 5.46019L9.73825 1.69618C10.0872 1.37636 10.0872 0.85973 9.73825 0.539912C9.38926 0.228295 8.81656 0.220094 8.46756 0.539912Z"
                  fill="#233566"
                />
              </svg>
            </button>
            <div
              className={`${styles.sort_items} ${
                activeSort && styles.active_sort_items
              }`}
            >
              <div
                className={styles["sort-item"]}
                onClick={() => SortByWhat(secondItem, setSecondItem)}
              >
                <span>{secondItem}</span>
              </div>
              <div
                className={styles["sort-item"]}
                onClick={() => SortByWhat(thirdItem, setThirdItem)}
              >
                <span>{thirdItem}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {services.length > 0 && <MarketplaceList services={services} />}
      {notFound && <span className={styles["not-found"]}>Нет результатов</span>}
    </div>
  );
};
// Например, «Юридическая консультация»
export default MarketplacesServices;
