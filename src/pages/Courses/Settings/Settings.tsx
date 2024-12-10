import { NavLink, useParams } from "react-router-dom";
import styles from "./Settings.module.css";
import Headling from "../../../components/Headling/Headling";
import Button from "../../../components/Button/Button";
import Tabs from "../../../components/Tabs/Tabs";
import Vendor from "../../../components/Vendor/Vendor";
import cn from "classnames";
import CourseModal from "../../../components/Courses/CourseModal/CourseModal";
import Lessons from "../../../components/Courses/Lessons/Lessons";
import LessonForm from "../../../components/Courses/LessonForm/LessonForm";
import NewLessonForm from "../../../components/Courses/NewLessonForm/NewLessonForm";

import useCourseData from "../../../hooks/useCourseData";
import useTabs from "../../../hooks/useTabs";
import useNotifications from "../../../hooks/useNotifications";
import useForm from "../../../hooks/useForm";
import InputLabel from "../../../components/InputLabel/InputLabel";
import TextareaLabel from "../../../components/TextareaLabel/TextareaLabel";
import { useState, useEffect } from "react";
import { updateCourse } from "../../../helpers/API";
import { Lesson } from "../../../helpers/API";
import { useCourseActions } from "../../../hooks/useCourseActions";

export function Settings() {
	const { id } = useParams<{ id: string }>();
	const { courseData, loading, error } = useCourseData(id);
	const { activeTab, handleTabClick } = useTabs();
	const { message, setMessage, vendorActive, setError } = useNotifications();
	const { values, handleInputChange, setValues } = useForm({
		title: "",
		description: "",
	});

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isCreatingLesson, setIsCreatingLesson] = useState(false);
	const [isEditingLesson, setIsEditingLesson] = useState(false);
	const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

	useEffect(() => {
		if (courseData) {
		setValues({
			title: courseData.name || "",
			description: courseData.description || "",
		});
		}
	}, [courseData, setValues]);

	const handleSave = async () => {
		if (!id) return;

		try {
		await updateCourse(id, values.title, values.description);
		setMessage("Данные успешно обновлены!");
		} catch (err) {
		setError(err instanceof Error ? err.message : "Ошибка при сохранении");
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

	const { handleCourseUpdate, loading: updateLoading } = useCourseActions(
		setMessage,
		setError
	);

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
		</div>;
	}

	if (!courseData) {
		return <div>Нет данных для отображения.</div>;
	}

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
		) : isEditingLesson ? (
			<LessonForm
			lesson={editingLesson}
			courseId={id || ""}
			onClose={handleCloseLessonForm}
			/>
		) : (
			<div className={styles["settings"]}>
				<div className={styles["settings__top"]}>
					<div className={styles["settings__top-left"]}>
						<NavLink to={"/"} className={styles["back"]}>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M10.4603 11.4676L7.27855 7.99553L10.4603 4.52349C10.7801 4.1745 10.7801 3.61074 10.4603 3.26174C10.1405 2.91275 9.62389 2.91275 9.30407 3.26174L5.54006 7.36913C5.22024 7.71812 5.22024 8.28188 5.54006 8.63087L9.30407 12.7383C9.62389 13.0872 10.1405 13.0872 10.4603 12.7383C10.7719 12.3893 10.7801 11.8166 10.4603 11.4676Z" fill="#233566" />
							</svg>
							<span>Назад</span>
						</NavLink>
						<Headling>Настройки курса</Headling>
					</div>
					<Button
						appearance="big"
						className={styles["settings-btn"]}
						onClick={() => setIsModalOpen(true)}
					>
						Создать курс
					</Button>
				</div>

				<div className={styles["settings__top"]}>
					<Tabs
						tabs={["Общие данные", "Уроки"]}
						activeTab={activeTab}
						onTabClick={handleTabClick}
					/>
					<div className={styles["settings__nav"]}>
						{activeTab === 0 ? (
							<>
							{courseData?.status !== "В архиве" && (
								<button
								className={cn(styles["settings-btn"], styles["archive"])}
								onClick={(e) => {
									e.stopPropagation();
									if (!id) {
									setError("Некорректный идентификатор курса.");
									return;
									}
									handleCourseUpdate(Number(id), 3, values.title);
								}}
								disabled={updateLoading}
								>
								<span>В архив</span>
								<img src="/settings/icons-archive.svg" alt="" />
								</button>
							)}
							<button
								className={cn(styles["settings-btn"], styles["delete"])}
								onClick={() => {
								if (!id) {
									setError("Некорректный идентификатор курса.");
									return;
								}
								handleCourseUpdate(Number(id), 4, values.title);
								}}
								disabled={updateLoading}
							>
								<span>Удалить курс</span>
								<img src="/settings/icons-delete.svg" alt="" />
							</button>
							</>
						) : (
							<button
							className={cn(styles["settings-btn"], styles["add-lesson"])}
							onClick={() => setIsCreatingLesson(true)}
							>
							<span>Добавить урок</span>
							<img src="/settings/add-lesson.svg" alt="" />
							</button>
						)}
						</div>
					</div>

			<div className={styles["settings__body"]}>
				{activeTab === 0 ? (
					<>
						<div className={styles['settings__wrap']}>
							<Headling appearance="small">Настройки курса </Headling>
							<form className={styles['form']}>
								<div className={styles['form__box']}>
									<InputLabel
										label="Название курса"
										id="course-name"
										value={values.title}
										onChange={(valueOrEvent) =>
											handleInputChange("title", valueOrEvent)
										}
									/>
									<TextareaLabel
										label="Описание курса"
										id="course-description"
										value={values.description}
										maxLength={320}
										onChange={(valueOrEvent) =>
											handleInputChange("description", valueOrEvent)
										}
									/>
								</div>
							</form>
						</div>
						<div className={styles['settings__bottom']}>
							<Button onClick={handleSave} className={styles['btn']} appearance="big">Сохранить</Button>
						</div>
					</>
				) : (
					<div className={styles['courses-list__wrap']}>
						<Lessons courseId={id || ""} onEditLesson={handleEditLesson} />
					</div>
				)}
			</div>
			</div>
		)}

		<CourseModal
			isOpen={isModalOpen}
			onClose={() => setIsModalOpen(false)}
			setCourses={() => {}}
		/>
		</>
	);
}

export default Settings;
