import { useEffect, useState } from "react";
import styles from "./LessonsCard.module.css";
import cn from 'classnames';
import { getLessonCategories, LessonCategory, Lesson, updateLessonSort, deleteLesson } from "../../../helpers/API";
import { useNavigate } from "react-router-dom";

interface LessonCardProps {
	courseId: number;
	onLessonLoader: (loaded: boolean, lessonsExist: boolean) => void;
	onEditLesson: (lesson: Lesson) => void;
}

const LessonsCard: React.FC<LessonCardProps> = ({ courseId, onLessonLoader, onEditLesson }) => {
	const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
	const userRole = localStorage.getItem('role');
	const navigate = useNavigate();

	const formatDate = (dateString: string): string => {
		try {
			const options: Intl.DateTimeFormatOptions = {
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			};
			return new Date(dateString).toLocaleDateString("ru-RU", options);
		} catch {
			return "Некорректная дата";
		}
	};

	const moveLessonUp = async (index: number) => {
		if (index === 0) return;
		const updatedLessons = [...lessons];
		[updatedLessons[index - 1], updatedLessons[index]] = [updatedLessons[index], updatedLessons[index - 1]];
		const courseIdNumber = Number(courseId);
		try {
			await Promise.all([
				updateLessonSort(courseIdNumber, Number(updatedLessons[index].id), index),
				updateLessonSort(courseIdNumber, Number(updatedLessons[index - 1].id), index - 1),
			]);
			setLessons(updatedLessons);
		} catch (error) {
			console.error("Ошибка при перемещении урока вверх:", error);
		}
	};
	
	const moveLessonDown = async (index: number) => {
		if (index === lessons.length - 1) return;
		const updatedLessons = [...lessons];
		[updatedLessons[index], updatedLessons[index + 1]] = [updatedLessons[index + 1], updatedLessons[index]];
		const courseIdNumber = Number(courseId);
		try {
			await Promise.all([
				updateLessonSort(courseIdNumber, Number(updatedLessons[index].id), index),
				updateLessonSort(courseIdNumber, Number(updatedLessons[index + 1].id), index + 1),
			]);
			setLessons(updatedLessons);
		} catch (error) {
			console.error("Ошибка при перемещении урока вниз:", error);
		}
	};
	
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				setLoading(true);
				const data = await getLessonCategories(courseId);
				const categories = Array.isArray(data) ? data : [data];
				const extractedLessons = categories
				.flatMap((category: LessonCategory) => category.lessons || [])
				.filter(Boolean);
		
				setLessons(extractedLessons);
				onLessonLoader(true, extractedLessons.length > 0);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Ошибка загрузки категорий");
			} finally {
				setLoading(false);
			}
		};
	
		fetchCategories();
	}, [courseId, onLessonLoader]);

	const handleEditLessonClick = (lesson: Lesson) => {
		if(userRole === "student") {
			navigate(`/course/${courseId}/lesson/${lesson.id}`, { state: { lesson } });
		} else {
			onEditLesson(lesson);
		}
	};

	const handleDeleteLesson = async (lessonId: number, categoryId: number) => {
		try {
			await deleteLesson(Number(courseId), categoryId, lessonId);
			setLessons((prevLessons) => prevLessons.filter((lesson) => Number(lesson.id) !== lessonId));
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Ошибка при удалении урока.";
			setError(errorMessage);
		}
	}

	if (loading) return <div className={styles['loading']}>
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
    if (error) return <div>{error}</div>;

	if (lessons.length === 0) return <div>Уроки отсутствуют</div>;

	if(userRole === "student") {
		return(
			<>
				{lessons.map((lesson, index) => (
					<div key={lesson.id} className={styles["card-lesson"]}>
						<div className={styles["card-lesson__first"]}>
							<div className={cn(styles["method"], styles["method_center"])}>
								<div className={cn(styles["method__current"])}>{index + 1}</div>
							</div>
							<button className={styles["title"]} onClick={() => handleEditLessonClick(lesson)}>{lesson.name}</button>
						</div>
						<div className={styles["card-lesson__last"]}>
							<div className={styles["date"]}>{lesson.updated_at ? formatDate(lesson.updated_at) : "Дата неизвестна"}</div>
						</div>
					</div>
				))}
			</>
		)
	}

	return (
		<>
			{lessons.map((lesson, index) => (
					<div key={lesson.id} className={styles["card-lesson"]}>
						<div className={styles["card-lesson__first"]}>
							<div className={styles["method"]}>
								<div className={styles["method__current"]}>{index + 1}</div>
								<div className={styles["method__nav"]}>
									<button className={cn(styles["method-moving"], styles["bottom"])} onClick={() => moveLessonDown(index)}>
										<img src="/CardLesson/bottom.svg" alt="" />
									</button>
									<button className={cn(styles["method-moving"], styles["top"])} onClick={() => moveLessonUp(index)}>
										<img src="/CardLesson/top.svg" alt="" />
									</button>
								</div>
							</div>
							<div className={styles["title"]}>{lesson.name}</div>
						</div>
						<div className={styles["card-lesson__last"]}>
							<div className={styles["date"]}>{lesson.updated_at ? formatDate(lesson.updated_at) : "Дата неизвестна"}</div>
							<div className={styles['card-lesson__nav']}>
								<button className={cn(styles['card-lesson-btn'], styles['settings'])} onClick={() => handleEditLessonClick(lesson)}>
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path fill-rule="evenodd" clip-rule="evenodd" d="M10 6.875C8.27411 6.875 6.875 8.27411 6.875 10C6.875 11.7259 8.27411 13.125 10 13.125C11.7259 13.125 13.125 11.7259 13.125 10C13.125 8.27411 11.7259 6.875 10 6.875ZM8.125 10C8.125 8.9645 8.9645 8.125 10 8.125C11.0355 8.125 11.875 8.9645 11.875 10C11.875 11.0355 11.0355 11.875 10 11.875C8.9645 11.875 8.125 11.0355 8.125 10Z" fill="#A4ABBE"/>
										<path fill-rule="evenodd" clip-rule="evenodd" d="M10 1.04175C9.41283 1.04175 8.87658 1.20307 8.29048 1.47539C7.7234 1.73888 7.06699 2.12761 6.24547 2.61412L5.6179 2.98577C4.79611 3.47243 4.13976 3.86111 3.63397 4.23295C3.11096 4.61744 2.70981 5.01101 2.41945 5.52685C2.12957 6.04186 1.99868 6.59254 1.93588 7.24596C1.87499 7.87957 1.87499 8.6555 1.875 9.63008V10.3701C1.87499 11.3447 1.87499 12.1206 1.93588 12.7542C1.99868 13.4077 2.12957 13.9583 2.41945 14.4733C2.70981 14.9892 3.11096 15.3827 3.63397 15.7672C4.13976 16.1391 4.79611 16.5277 5.6179 17.0144L6.2455 17.3861C7.06698 17.8726 7.72342 18.2613 8.29048 18.5247C8.87658 18.7971 9.41283 18.9584 10 18.9584C10.5872 18.9584 11.1234 18.7971 11.7095 18.5247C12.2766 18.2612 12.933 17.8726 13.7545 17.3861L14.3821 17.0144C15.2038 16.5277 15.8602 16.1391 16.366 15.7672C16.8891 15.3827 17.2902 14.9892 17.5806 14.4733C17.8704 13.9583 18.0013 13.4077 18.0641 12.7542C18.125 12.1206 18.125 11.3447 18.125 10.3702V9.63008C18.125 8.65558 18.125 7.87956 18.0641 7.24596C18.0013 6.59254 17.8704 6.04186 17.5806 5.52685C17.2902 5.01101 16.8891 4.61744 16.366 4.23295C15.8602 3.86111 15.2039 3.47244 14.3821 2.98579L13.7545 2.61412C12.933 2.12761 12.2766 1.73888 11.7095 1.47539C11.1234 1.20307 10.5872 1.04175 10 1.04175ZM6.85437 3.70628C7.71032 3.19939 8.31338 2.84309 8.81725 2.60899C9.3085 2.38071 9.65892 2.29175 10 2.29175C10.3411 2.29175 10.6915 2.38071 11.1827 2.60899C11.6866 2.84309 12.2897 3.19939 13.1457 3.70628L13.7174 4.04491C14.5732 4.55172 15.1757 4.90937 15.6257 5.24008C16.0639 5.56231 16.3175 5.8313 16.4912 6.13998C16.6655 6.44949 16.7666 6.81166 16.8198 7.36554C16.8743 7.93245 16.875 8.64841 16.875 9.6615V10.3387C16.875 11.3517 16.8743 12.0677 16.8198 12.6346C16.7666 13.1885 16.6655 13.5507 16.4912 13.8602C16.3175 14.1688 16.0639 14.4378 15.6257 14.7601C15.1757 15.0908 14.5732 15.4484 13.7174 15.9552L13.1457 16.2939C12.2897 16.8007 11.6866 17.1571 11.1827 17.3912C10.6915 17.6194 10.3411 17.7084 10 17.7084C9.65892 17.7084 9.3085 17.6194 8.81725 17.3912C8.31338 17.1571 7.71032 16.8007 6.85437 16.2939L6.28258 15.9552C5.42675 15.4484 4.82422 15.0908 4.37436 14.7601C3.93605 14.4378 3.6825 14.1688 3.50875 13.8602C3.33454 13.5507 3.23338 13.1885 3.18015 12.6346C3.12567 12.0677 3.125 11.3517 3.125 10.3387V9.6615C3.125 8.64841 3.12567 7.93245 3.18015 7.36554C3.23338 6.81166 3.33454 6.44949 3.50875 6.13998C3.6825 5.8313 3.93605 5.56231 4.37436 5.24008C4.82422 4.90937 5.42675 4.55172 6.28258 4.04491L6.85437 3.70628Z" fill="#A4ABBE"/>
									</svg>
								</button>
								<button className={cn(styles['card-lesson-btn'], styles['delete'])} onClick={() => handleDeleteLesson(Number(lesson.id), Number(lesson.categoryId))}>
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path fill-rule="evenodd" clip-rule="evenodd" d="M10.0003 1.0415C5.05277 1.0415 1.04199 5.05229 1.04199 9.99984C1.04199 14.9474 5.05277 18.9582 10.0003 18.9582C14.9479 18.9582 18.9587 14.9474 18.9587 9.99984C18.9587 5.05229 14.9479 1.0415 10.0003 1.0415ZM2.29199 9.99984C2.29199 5.74264 5.74313 2.2915 10.0003 2.2915C11.9041 2.2915 13.6467 2.98165 14.9915 4.12539C14.9859 4.13055 14.9805 4.13583 14.9751 4.14123L4.14173 14.9743C4.1363 14.9798 4.13098 14.9853 4.12579 14.9909C2.9821 13.6461 2.29199 11.9036 2.29199 9.99984ZM5.00907 15.8742C6.35392 17.018 8.09652 17.7082 10.0003 17.7082C14.2575 17.7082 17.7087 14.257 17.7087 9.99984C17.7087 8.09609 17.0185 6.35352 15.8747 5.00869C15.8696 5.01424 15.8643 5.01972 15.8589 5.02512L5.02561 15.8583C5.02017 15.8637 5.01466 15.869 5.00907 15.8742Z" fill="#A4ABBE" />
									</svg>
								</button>
							</div>
						</div>
					</div>
				))}
		</>
	)
}

export default LessonsCard;