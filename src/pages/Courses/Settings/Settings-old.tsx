import { NavLink, useParams } from "react-router-dom";
import styles from "./Settings.module.css";
import Headling from "../../../components/Headling/Headling";
import Button from "../../../components/Button/Button";
import Tabs from "../../../components/Tabs/Tabs";
import { useEffect, useState } from "react";
import InputLabel from "../../../components/InputLabel/InputLabel";
import TextareaLabel from "../../../components/TextareaLabel/TextareaLabel";
import { CourseData, getCourseById, Lesson, updateCourse, updateCourseStatus } from "../../../helpers/API";
import Vendor from "../../../components/Vendor/Vendor";
import cn from 'classnames';
import CourseModal from "../../../components/Courses/CourseModal/CourseModal";
import { Course } from "../../../hooks/useFormModal";
import { HandleArchive } from "../../../components/Accordion/Accordion";
import Lessons from "../../../components/Courses/Lessons/Lessons";
import LessonForm from "../../../components/Courses/LessonForm/LessonForm";
import NewLessonForm from "../../../components/Courses/NewLessonForm/NewLessonForm";

export function Settings() {
	const [activeTab, setActiveTab] = useState(0);
    const { id } = useParams<{ id: string }>();
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [vendorActive, setVendorActive] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isCreatingLesson, setIsCreatingLesson] = useState(false);
	const [isEditingLesson, setIsEditingLesson] = useState(false);
	const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
	const [, setCourses] = useState<Course[]>([]);

	useEffect(() => {
        if (message || error) {
            setVendorActive(true);
            const timer = setTimeout(() => setVendorActive(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, error]);
	
	useEffect(() => {
        const fetchCourseData = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await getCourseById(id);
                setCourseData(data);
				setTitle(data.name);
				setDescription(data.description);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Неизвестная ошибка");
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [id]);

	useEffect(() => {
		console.log("Title updated:", title);
	}, [title]);
	
	useEffect(() => {
		console.log("Description updated:", description);
	}, [description]);

	const handleTabClick = (index: number) => setActiveTab(index);

	const handleSave = async () => {
        setMessage(null);
		if(!id) return;

		try {
			await updateCourse(id, title, description);
			setMessage("Данные успешно обновлены!");
		} catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка при сохранении");
        } finally {
            setLoading(false);
        }
	}

	const numericId = id ? Number(id) : null;

	if (numericId === null || isNaN(numericId)) {
		setError("Некорректный идентификатор курса.");
	}
	const handleCourseUpdate: HandleArchive = async (id: number, newStatus: number, title: string) => {
		try {
			await updateCourseStatus(id, newStatus, title);

			const statusText = newStatus === 3 ? "В архиве" : "Удалён";
			const successMessage =
				newStatus === 3
					? `Курс ${title} успушно перенесён В архив.`
					: `Курс ${title} успушно удалён.`;

			setCourses((prevCourses) => 
				prevCourses.map((course) => 
					course.id === id ? { ...course, statusId: newStatus, status: statusText } : course
				)	
			);

			setMessage(successMessage);
		} catch (error: unknown) {
			const errorMessage = 
				typeof error === "object" && error !== null
					? Object.values(error).flat().join(", ")
					: String(error) || "Неизвестная ошибка.";

			setError(errorMessage);
		}
	};

	const handleInputChange = (
		valueOrEvent: string | React.ChangeEvent<HTMLInputElement>,
			onChange: (value: string) => void
		) => {
		if (typeof valueOrEvent === "string") {
			onChange(valueOrEvent);
		} else {
			onChange(valueOrEvent.target.value);
		}
	};

	const handleEditLesson = (lesson: Lesson) => {
		setEditingLesson(lesson);
		setIsEditingLesson(true);
	};

	const handleCloseLessonForm = () => {
		setEditingLesson(null);
		setIsEditingLesson(false);
	};

	const handleNewLessonCreated = () => {
        setIsCreatingLesson(false);
    };

    if (loading) {
		return <div className={styles['loading']}>
			<svg xmlns="http://www.w3.org/2000/svg" width="120" height="30" viewBox="0 0 120 30" fill="#0050ff">
				<circle cx="15" cy="15" r="12">
					<animate attributeName="r" from="12" to="12" begin="0s" dur="0.8s" values="12;9;12" calcMode="linear" repeatCount="indefinite" />
					<animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite" />
				</circle>
				<circle cx="60" cy="15" r="9" fill-opacity="0.5">
					<animate attributeName="r" from="9" to="9" begin="0.2s" dur="0.8s" values="9;12;9" calcMode="linear" repeatCount="indefinite" />
					<animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0.2s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite" />
				</circle>
				<circle cx="105" cy="15" r="9" fill-opacity="0.5">
					<animate attributeName="r" from="9" to="9" begin="0.4s" dur="0.8s" values="9;12;9" calcMode="linear" repeatCount="indefinite" />
					<animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0.4s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite" />
				</circle>
			</svg>
		</div>
	};
    if (!courseData) return <div>Нет данных для отображения.</div>;

	return (
		<>

			<Vendor className={cn({ [styles.active]: vendorActive })}>
				{message && <>{message}</>}
				{error && <>{error}</>}
			</Vendor>
			
			{isCreatingLesson ? (
				<NewLessonForm 
					courseId={id || ""}
					onClose={() => setIsCreatingLesson(false)}
					onLessonCreated={handleNewLessonCreated}
				/>
			) : (
				<>
				{isEditingLesson ? (
					<LessonForm lesson={editingLesson} courseId={id || ""} onClose={handleCloseLessonForm} />
				) : (
					<div className={styles['settings']}>
						<div className={styles['settings__top']}>
							<div className={styles['settings__top-left']}>
								<NavLink to={'/'} className={styles['back']}>
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M10.4603 11.4676L7.27855 7.99553L10.4603 4.52349C10.7801 4.1745 10.7801 3.61074 10.4603 3.26174C10.1405 2.91275 9.62389 2.91275 9.30407 3.26174L5.54006 7.36913C5.22024 7.71812 5.22024 8.28188 5.54006 8.63087L9.30407 12.7383C9.62389 13.0872 10.1405 13.0872 10.4603 12.7383C10.7719 12.3893 10.7801 11.8166 10.4603 11.4676Z" fill="#233566" />
									</svg>
									<span>Назад</span>
								</NavLink>
								<Headling>Настройки курса </Headling>
							</div>
							<Button appearance="big" className={styles['settings-btn']} onClick={() => setIsModalOpen(true)}>Создать курс</Button>
						</div>
						<div className={styles['settings__top']}>
							<Tabs
								tabs={["Общие данные", "Уроки"]}
								activeTab={activeTab}
								onTabClick={handleTabClick}
							/>
							<div className={styles['settings__nav']}>
								{activeTab === 0 ? (
									<>
										{courseData?.status !== 'В архиве' && (
											<button className={cn(styles['settings-btn'], styles['archive'])} onClick={(e) => {
												e.stopPropagation();
												if (!numericId) {
													setError("Некорректный идентификатор курса.");
													return;
												}
												handleCourseUpdate(numericId, 3, title);
											}}>
												<span>В архив</span>
												<img src="/settings/icons-archive.svg" alt="" />
											</button>
										)}
										<button className={cn(styles['settings-btn'], styles['delete'])}>
											<span>Удалить курс</span>
											<img src="/settings/icons-delete.svg" alt="" />
										</button>
									</>
								) : (
									<button className={cn(styles['settings-btn'], styles['add-lesson'])} onClick={() => setIsCreatingLesson(true)}>
										<span>Добавить урок</span>
										<img src="/settings/add-lesson.svg" alt="" />
									</button>
								)}
							</div>
						</div>
						<div className={styles['settings__body']}>
							{activeTab === 0 && (
								<>
									<div className={styles['settings__wrap']}>
										<Headling appearance="small">Настройки курса </Headling>
										<form className={styles['form']}>
											<div className={styles['form__box']}>
												<InputLabel
													label="Название курса"
													type="text"
													id="course-name"
													value={title}
													onChange={(valueOrEvent) => handleInputChange(valueOrEvent, setTitle)}
												/>
												<TextareaLabel
													label="Описание курса"
													id="course-description"
													value={description}
													maxLength={320}
													onChange={(valueOrEvent) => handleInputChange(valueOrEvent, setDescription)}
												/>
											</div>
										</form>
									</div>
									<div className={styles['settings__bottom']}>
										<Button onClick={handleSave} className={styles['btn']} appearance="big">Сохранить</Button>
									</div>
								</>
							)}
							{activeTab === 1 && (
								<div className={styles['courses-list__wrap']}>
									<Lessons courseId={id || ""} onEditLesson={handleEditLesson}/>
								</div>
							)}
						</div>
					</div>
				)}
				</>
			)}
			<CourseModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				setCourses={setCourses}
			/>
		</>
	)
}

export default Settings;
