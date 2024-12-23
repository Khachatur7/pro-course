import { useEffect, useState } from "react";
import ModalWindow from "../../../components/ModalWindow/ModalWindow";
import InputLabel from "../../../components/InputLabel/InputLabel";
import Button from "../../../components/Button/Button";
import Vendor from "../../../components/Vendor/Vendor";
import cn from "classnames";
import styles from "./StudentModal.module.css";
import { addStudentToCourse, Student } from "../../../helpers/API";

interface StudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: string;
	onStudentAdded: (newStudent: Student) => void;
}

const StudentModal: React.FC<StudentModalProps> = ({ isOpen, onClose, courseId, onStudentAdded }) => {
	const [phone, setPhone] = useState("");
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

	const handleAddStudent = async () => {
		setIsLoading(true);
		setMessage(null);
		setError(null);

		try {
			
			const formattedPhone = phone.replace(/^\+/, "");

			const newStudent = await addStudentToCourse(courseId, { phone: formattedPhone });
			setMessage("Студент успешно добавлен!");
			setPhone("");
			onStudentAdded(newStudent);
			onClose();
		} catch (err) {
			setError(err instanceof Error ? [err.message] : ["Ошибка при добавлении студента"]);
		} finally {
			setIsLoading(false);
		}
	}

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

	return (
		<>
			<Vendor className={cn({ [styles.active]: vendorActive })}>
				{message && <p>{message}</p>}
				{error && <p>{error}</p>}
			</Vendor>
			<ModalWindow isOpen={isOpen} onClosed={onClose} title="Добавить нового студента">
				<form className={styles["form"]}>
					<InputLabel
						label="Телефон"
						type="input"
						id='phone' 
						mask='+7 (999) 999-99-99'
						value={phone}
						onChange={(valueOrEvent) => handleInputChange(valueOrEvent, setPhone)}
					/>
					<div className={styles["form-nav"]}>
						<Button
							className={styles["form-btn"]}
							appearance="item"
							onClick={onClose}
						>Отменить</Button>
						<Button
							className={styles["form-btn"]}
							appearance="big"
							onClick={handleAddStudent}
							disabled={isLoading}
						>{isLoading ? "Добавление..." : "Добавить студента"}</Button>
					</div>
				</form>
			</ModalWindow>
		</>
	);
};

export default StudentModal;
