import { Dispatch, SetStateAction, useState } from "react";
import styles from "./OrdersList.module.css";
import Button from "../../../components/Button/Button";
import { Form } from "../../../api/orders";
import OrdersModal from "../../../components/Orders/OrdersModal/OrdersModal";
import OrdersAccordion from "../../../components/Orders/OrdersAccordion/OrdersAccordion";

interface OrdersListProps {
	forms: Form[];
	setForms: Dispatch<SetStateAction<Form[]>>;
}

const OrdersList: React.FC<OrdersListProps> = ({ forms, setForms }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const userRole = localStorage.getItem("role");

	return (
		<div className={styles["orders-list"]}>
			{userRole !== "student" && (
			<div className={styles["orders-list__top"]}>
				<Button appearance="big" onClick={() => setIsModalOpen(true)}>
				Создать форму
				</Button>
			</div>
			)}
			<div className={styles["orders-list__content"]}>
			{forms.map((form) => (
				<OrdersAccordion key={form.id} form={form} setForms={setForms} />
			))}
			</div>
			{userRole !== "student" && (
			<OrdersModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				setForms={setForms}
			/>
			)}
		</div>
	);
};

export default OrdersList;
