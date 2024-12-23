import { Dispatch, SetStateAction, useState } from 'react';
import Button from '../../Button/Button';
import styles from './OrdersCard.module.css';
import { Form } from '../../../api/orders';
import OrdersModal from '../OrdersModal/OrdersModal';

interface OrdersCardProps {
	title: string;
	description: string;
	onCreate?: (course: { title: string; description: string }) => void;
	setForms: Dispatch<SetStateAction<Form[]>>;
}

const OrdersCard: React.FC<OrdersCardProps> = ({ title, description, setForms }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<div className={styles["card"]}>
				<img src="/Image.svg" alt={title} className={styles["card__image"]} />
				<div className={styles["card__content"]}>
				<h3 className={styles["content__title"]}>{title}</h3>
				<div
					className={styles["content__description"]}
					dangerouslySetInnerHTML={{ __html: description }}
				/>
					<div className={styles["content__actions"]}>
						<Button onClick={() => setIsModalOpen(true)} appearance="big" type="submit">Создать форму</Button>
					</div>
				</div>
			</div>
			<OrdersModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				setForms={setForms}
			/>
		</>
	);
};

export default OrdersCard;