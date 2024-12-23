import MarketplaceCard from "../MarketplacesCard/MarketplacesCard";
import styles from "./MarketplacesList.module.css";

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

interface MarketplacesListProps {
  services: IExpert[];
}

const MarketplaceList: React.FC<MarketplacesListProps> = ({ services }) => {
  return (
    <div className={styles["grid"]}>
      {services.map((service) => (
        <MarketplaceCard
          id={service.id}
          key={service.id}
          image={service.photo}
          name={service.name}
          title={service.lastname}
          services={service.services_list}
          additionalServices={service.services_count}
          price={service.services_list[0].price}
        />
      ))}
    </div>
  );
};

export default MarketplaceList;
