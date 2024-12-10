import { useNavigate, useParams } from "react-router-dom";
import ExpertCard from "../../components/ExpertCard/expertCard";
import ServiceCard from "../../components/ServiceCard/serviceCard";
import styles from "../Expert/Expert.module.css";
import { BaseUrl } from "../../api/BaseUrl";
import axios from "axios";
import { useEffect, useState } from "react";
import ModalWindow from "../../components/ModalWindow/ModalWindow";
import InputLabel from "../../components/InputLabel/InputLabel";
import TextareaLabel from "../../components/TextareaLabel/TextareaLabel";
import Button from "../../components/Button/Button";

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

const Expert = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [expert, setExpert] = useState<IExpert>();
  const [course, setCourse] = useState<IService>();
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [modal, setModal] = useState<boolean>(false);
  const GetUser = async () => {
    try {
      const res = await axios.get<IExpert>(`${BaseUrl}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status == 200) {
        setExpert(res.data);
        setCourse(res.data.services_list[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const CreateOrder = async () => {
    if (email.includes("@") && email.includes(".")) {
      try {
        const res = await axios.post(`${BaseUrl}/order`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: {
            contact: email,
            message: message,
            services_id: course?.id,
          },
        });

        if (res.status == 200) {
          console.log(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleInputChange = (
    valueOrEvent: string | React.ChangeEvent<HTMLInputElement>,
    onChange: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (typeof valueOrEvent === "string") {
      onChange(valueOrEvent);
    } else {
      onChange(valueOrEvent.target.value);
    }
  };

  const CancelModel = () => {
    setModal(false);
    setEmail("");
    setMessage("");
  };
  useEffect(() => {
    GetUser();
  }, []);

  return (
    <div className={styles["expert-page"]}>
      <div className={styles["navigation"]}>
        <button className={styles["go-back-btn"]} onClick={() => navigate(-1)}>
          <svg
            width="6"
            height="10"
            viewBox="0 0 6 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.539668 1.53244L3.72145 5.00447L0.539668 8.47651C0.21985 8.8255 0.21985 9.38926 0.539668 9.73826C0.859486 10.0872 1.37611 10.0872 1.69593 9.73826L5.45994 5.63087C5.77976 5.28188 5.77976 4.71812 5.45994 4.36913L1.69593 0.261745C1.37611 -0.0872478 0.859486 -0.0872478 0.539668 0.261745C0.228051 0.610739 0.21985 1.18344 0.539668 1.53244Z"
              fill="#233566"
            />
          </svg>
          <span>Назад</span>
        </button>
        <span className={styles["navigation-title"]}>Специалист</span>
      </div>
      {expert && course && (
        <ExpertCard
          onClick={() => setModal(true)}
          image={expert.photo}
          title={expert.lastname}
          name={`${expert.name} ${expert.middle_name}`}
          price={course?.price}
          profession={expert.specialization}
        />
      )}
      {expert && (
        <div className={styles["about-expert"]}>
          <span className={styles["about-expert-title"]}>О себе</span>
          <p className={styles["description"]}>{expert.description}</p>
        </div>
      )}
      {expert && (
        <div className={styles["services-prices"]}>
          <span className={styles["services-prices-title"]}>Услуги и цены</span>
          <div className={styles["services-prices-list"]}>
            {expert.services_list.map((s) => {
              return (
                <ServiceCard
                  price={s.price}
                  name={s.name}
                  key={s.id + s.name}
                  onClick={() => {
                    setCourse(s);
                    setModal(true);
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
      {modal && (
        <ModalWindow
          isOpen={modal}
          onClosed={() => setModal(false)}
          title="Заказ курса"
        >
          <form className={styles["form"]}>
            <InputLabel
              label="Ваш email"
              type="email"
              id="user-email"
              value={email}
              onChange={(e) => handleInputChange(e, setEmail)}
            />
            <TextareaLabel
              label="Сообщение специалисту"
              id="message"
              maxLength={320}
              value={message}
              onChange={(e) => handleInputChange(e, setMessage)}
            />
            <div className={styles["form-nav"]}>
              <Button
                className={styles["form-btn"]}
                appearance="item"
                onClick={CancelModel}
              >
                Отменить
              </Button>
              <Button
                className={styles["form-btn"]}
                appearance="big"
                onClick={CreateOrder}
              >
                {"Создать курс"}
              </Button>
            </div>
          </form>
        </ModalWindow>
      )}
    </div>
  );
};

export default Expert;
