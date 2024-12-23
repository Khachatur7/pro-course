import { useEffect, useState } from "react";
import Headling from "../../Headling/Headling";
import InputLabel from "../../InputLabel/InputLabel";
import styles from "./LessonForm.module.css";
import Button from "../../Button/Button";
import SlateTextarea from "../../SlateTextarea/SlateTextarea";
import { Lesson, updateLessonData } from "../../../helpers/API";
import { NavLink } from "react-router-dom";

interface LessonFormProps {
    lesson: Lesson | null;
    courseId: string;
    onClose: () => void;
	setError: (message: string | null) => void;
	setMessage: (message: string | null) => void;
}

const LessonForm: React.FC<LessonFormProps> = ({ lesson, courseId, onClose, setError, setMessage }) => {
    const [title, setTitle] = useState<string>(lesson?.name || "");
    const [description, setDescription] = useState<string>(lesson?.description || "");
    const [content, setContent] = useState<string>(lesson?.content || "");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isPreviewing, setIsPreviewing] = useState<boolean>(false);

    useEffect(() => {

        if (lesson) {
            setTitle(lesson.name);
            setDescription(lesson.description === "<p><br></p>" ? "" : lesson.description);
            setContent(lesson.content);
			console.log("Rendering LessonForm:", lesson);
        }
    }, [lesson]);

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
        if (!lesson) {
            return;
        }

		const cleanedDescription = description === "<p><br></p>" ? "" : description;

        setIsSaving(true);
        setError(null);
        setMessage(null);

        try {
            await updateLessonData(courseId, lesson.id, title, cleanedDescription, content);
            setMessage("Урок успешно обновлён!");
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            if (err instanceof Error) {
                const errorMessage = err.message.includes("Категории для данного курса не найдены")
                    ? "Категории для курса отсутствуют. Проверьте настройки курса."
                    : err.message;
                setError(errorMessage);
            } else {
                setError("Неизвестная ошибка.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (isPreviewing) {
        return (
            <div className={styles['preview']}>
                <div className={styles['preview__header']}>
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
                    <Headling>Урок «{title}»</Headling>
                </div>
                <div className={styles['preview__body']}>
					<div className={styles['preview__wrap']}>
						<h1>{title}</h1>
						<div dangerouslySetInnerHTML={{ __html: description }} className={styles['desc']} />
						{content && (
							<NavLink to={content}>
								<img src="/link-outline.svg" alt="" />
								{content}
							</NavLink>
						)}
					</div>
                </div>
            </div>
        );
    }
    return (
        <div className={styles["form"]}>
            <div className={styles["form__top"]}>
                <div className={styles["form__top-box"]}>
                    <button onClick={onClose} className={styles["back"]}>
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
                    <Headling>Урок «{title}»</Headling>
                </div>
                <div className={styles["form__nav"]}>
                    <button className={styles["preview-btn"]} onClick={() => setIsPreviewing(true)}>
                        Предпросмотр
                    </button>
                </div>
            </div>
            <div className={styles["form__body"]}>
                <Headling appearance="small">Общие данные</Headling>
                <div className={styles["form__wrap"]}>
                    <div className={styles["form__box"]}>
                        <InputLabel
                            label="Название урока"
                            type="text"
                            id="lesson-name"
                            value={title}
                            onChange={(valueOrEvent) => handleInputChange(valueOrEvent, setTitle)}
                        />
                    </div>
                    <SlateTextarea
                        label=""
                        id="cours-desc"
                        value={description}
                        onChange={(valueOrEvent) => handleInputChange(valueOrEvent, setDescription)}
                    />
                    <div className={styles["form__box"]}>
                        <InputLabel
                            label="Ссылка на видео"
                            type="text"
                            id="content"
                            value={content}
                            onChange={(valueOrEvent) => handleInputChange(valueOrEvent, setContent)}
                        />
                    </div>
                </div>
            </div>
            <div className={styles["form__bottom"]}>
                <Button
                    onClick={handleSave}
                    className={styles["btn"]}
                    appearance="big"
                    disabled={isSaving}
                >
                    {isSaving ? "Сохранение..." : "Сохранить"}
                </Button>
            </div>
        </div>
    );
};

export default LessonForm;
