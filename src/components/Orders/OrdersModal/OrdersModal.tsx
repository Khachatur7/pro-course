import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ModalWindow from "../../../components/ModalWindow/ModalWindow";
import InputLabel from "../../../components/InputLabel/InputLabel";
import TextareaLabel from "../../../components/TextareaLabel/TextareaLabel";
import Button from "../../../components/Button/Button";
import Vendor from "../../../components/Vendor/Vendor";
import cn from "classnames";
import styles from "./OrdersModal.module.css";
import { createForm, Form } from "../../../api/orders";

interface OrdersModalProps  {
	isOpen: boolean;
	onClose: () => void;
	setForms: Dispatch<SetStateAction<Form[]>>;
}

const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose, setForms }) => {
	const [newTitle, setNewTitle] = useState("");
	const [newDescription, setNewDescription] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [vendorActive, setVendorActive] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string[] | null>(null);

	useEffect(() => {
		if (message || error) {
		setVendorActive(true);
		const timer = setTimeout(() => setVendorActive(false), 3000);
		return () => clearTimeout(timer);
		}
	}, [message, error]);

	const handleCreate = async () => {
		setIsLoading(true);
		setMessage(null);
		setError(null);

		try {
			const newForm = await createForm({
				form: {
					name: newTitle,
					description: newDescription,
				},
				fields: [
					{
						type: "text",
						label: "Пример текста",
						placeholder: "Введите данные",
						is_required: true,
					},
				],
				message: {
					label: "Сообщение",
					message: "Форма успешно создана!",
				},
			});
	
			setMessage("Форма успешно создана!");
			setForms((prevForms) => [...prevForms, newForm]);
			setNewTitle("");
			setNewDescription("");
			onClose();
		} catch (error: unknown) {
			if (typeof error === "object" && error !== null) {
				const allMessages = Object.values(error).flat();
				setError(allMessages as string[]);
			} else {
				setError([String(error) || "Неизвестная ошибка."]);
			}
		} finally {
			setIsLoading(false);
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

	const renderErrors = (errors: string[] | null) => {
		if (!errors) return null;
	
		return (
			<div>
				{errors.map((message, index) => (
					<span key={index}>{message}</span>
				))}
			</div>
		);
	};

	return (
		<>
			<Vendor className={cn({ [styles.active]: vendorActive })}>
				{message && <p>{message}</p>}
				{error && renderErrors(error)}
			</Vendor>
			<ModalWindow isOpen={isOpen} onClosed={onClose} title="Создание новой формы">
				<form className={styles["form"]}>
				<div className={styles["form-subtitle"]}>
					Вы всегда сможете отредактировать данные о форме или удалить её в разделе «Формы»
				</div>
				<InputLabel
					label="Название формы"
					type="text"
					id="form-name"
					value={newTitle}
					onChange={(valueOrEvent) => handleInputChange(valueOrEvent, setNewTitle)}
				/>
				<TextareaLabel
					label="Описание формы"
					id="form-desc"
					value={newDescription}
					onChange={(valueOrEvent) => handleInputChange(valueOrEvent, setNewDescription)}
					maxLength={320}
				/>
				<div className={styles["form-nav"]}>
					<Button
					className={styles["form-btn"]}
					appearance="item"
					onClick={onClose}
					>
					Отменить
					</Button>
					<Button
					className={styles["form-btn"]}
					appearance="big"
					onClick={handleCreate}
					disabled={isLoading}
					>
					{isLoading ? "Создание..." : "Создать форму"}
					</Button>
				</div>
				</form>
			</ModalWindow>
		</>
	);
};

export default OrdersModal;
