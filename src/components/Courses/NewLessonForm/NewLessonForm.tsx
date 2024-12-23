import { useState } from 'react';
import Headling from '../../Headling/Headling';
import InputLabel from '../../InputLabel/InputLabel';
import styles from './NewLessonForm.module.css';
import Button from '../../Button/Button';
import SlateTextarea from '../../SlateTextarea/SlateTextarea';
import { createLesson } from '../../../helpers/API';
import Vendor from "../../Vendor/Vendor";
import cn from "classnames";

interface NewLessonFormProps {
    courseId: string;
    onClose: () => void;
    onLessonCreated: () => void;
}

interface ServerErrorResponse {
    [field: string]: string[];
}

const NewLessonForm: React.FC<NewLessonFormProps> = ({ courseId, onClose, onLessonCreated }) => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isPreviewing, setIsPreviewing] = useState<boolean>(false);
	const [vendorActive, setVendorActive] = useState(false);
	const [localMessage, setLocalMessage] = useState<string | null>(null);
	const [localError, setLocalError] = useState<string[] | null>(null);

    const handleInputChange = (
        valueOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        onChange: (value: string) => void
    ) => {
        if (typeof valueOrEvent === "string") {
            onChange(valueOrEvent);
        } else {
            onChange(valueOrEvent.target.value);
        }
    };

    const handleSave = async () => {
		setIsSaving(true);
		setLocalError(null);
		setLocalMessage(null);
	
		try {
			await createLesson(courseId, {
				name: title,
				description,
				content,
			});
	
			setLocalMessage("Урок успешно создан!");
			setVendorActive(true);
	
			setTimeout(() => {
				setVendorActive(false);
			}, 1500);
	
			onLessonCreated();
			setTimeout(onClose, 1500);
		} catch (err) {
			if (err instanceof Response) {
				try {
					const errorData: ServerErrorResponse = await err.json();
					const errorMessages = Object.entries(errorData)
						.map(([field, messages]) => `${field}: ${messages.join(", ")}`);
					setLocalError(errorMessages);
				} catch {
					setLocalError(["Не удалось обработать ошибку сервера."]);
				}
			} else {
				setLocalError([err instanceof Error ? err.message : "Неизвестная ошибка."]);
			}
	
			setVendorActive(true);
	
			setTimeout(() => {
				setVendorActive(false);
			}, 3000);
		} finally {
			setIsSaving(false);
		}
	};

	if (isPreviewing) {
		return (
		<div className={styles["preview"]}>
			<div className={styles["preview__header"]}>
			<button
				onClick={() => setIsPreviewing(false)}
				className={styles["back"]}
			>
				<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				>
				<path
					d="M10.4603 11.4676L7.27855 7.99553L10.4603 4.52349C10.7801 4.1745 10.7801 3.61074 10.4603 3.26174C10.1405 2.91275 9.62389 2.91275 9.30407 3.26174L5.54006 7.36913C5.22024 7.71812 5.22024 8.28188 5.54006 8.63087L9.30407 12.7383C9.62389 13.0872 10.1405 13.0872 10.4603 12.7383C10.7719 12.3893 10.7801 11.8166 10.4603 11.4676Z"
					fill="#233566"
				/>
				</svg>
				<span>Назад</span>
			</button>
			<Headling>Предпросмотр урока</Headling>
			</div>
			<div className={styles["preview__body"]}>
			<div className={styles["preview__wrap"]}>
				<h1>{title}</h1>
				<div dangerouslySetInnerHTML={{ __html: description }} className={styles['desc']} />
				<a href={content}>
					<img src="/link-outline.svg" alt="" />
					{content}
				</a>
			</div>
			</div>
		</div>
		);
	}

    return (
        <div className={styles['form']}>
			<Vendor className={cn({ [styles.active]: vendorActive })}>
				{localMessage && <div className={styles.message}>{localMessage}</div>}
				{localError && (
					<ul className={styles.errorList}>
						{localError.map((error, index) => (
							<li key={index}>{error}</li>
						))}
					</ul>
				)}
			</Vendor>
            <div className={styles['form__top']}>
				<div className={styles["form__top-box"]}>
					<button onClick={onClose} className={styles['back']}>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M10.4603 11.4676L7.27855 7.99553L10.4603 4.52349C10.7801 4.1745 10.7801 3.61074 10.4603 3.26174C10.1405 2.91275 9.62389 2.91275 9.30407 3.26174L5.54006 7.36913C5.22024 7.71812 5.22024 8.28188 5.54006 8.63087L9.30407 12.7383C9.62389 13.0872 10.1405 13.0872 10.4603 12.7383C10.7719 12.3893 10.7801 11.8166 10.4603 11.4676Z" fill="#233566" />
						</svg>
						<span>Назад</span>
					</button>
					<Headling>Создание нового урока</Headling>
                </div>
                <div className={styles["form__nav"]}>
					<button
						className={styles["preview-btn"]}
						onClick={() => setIsPreviewing(true)}
						>
						Предпросмотр
					</button>
                </div>
            </div>
            <div className={styles['form__body']}>
                <Headling appearance="small">Общие данные</Headling>
                <div className={styles['form__wrap']}>
					<div className={styles['form__box']}>
						<InputLabel
							label="Название урока"
							type="text"
							id="lesson-name"
							value={title}
							onChange={(valueOrEvent) => handleInputChange(valueOrEvent, setTitle)}
						/>
					</div>
                    <SlateTextarea
                        label="Описание урока"
                        id="lesson-desc"
                        value={description}
                        onChange={(valueOrEvent) => handleInputChange(valueOrEvent, setDescription)}
                    />
					<div className={styles['form__box']}>
						<InputLabel
							label="Ссылка на видео"
							type="text"
							id="lesson-content"
							value={content}
							onChange={(valueOrEvent) => handleInputChange(valueOrEvent, setContent)}
						/>
					</div>
                </div>
            </div>
            <div className={styles['form__bottom']}>
                <Button onClick={handleSave} className={styles['btn']} appearance="big" disabled={isSaving}>
                    {isSaving ? "Сохранение..." : "Создать урок"}
                </Button>
            </div>
        </div>
    );
};

export default NewLessonForm;
