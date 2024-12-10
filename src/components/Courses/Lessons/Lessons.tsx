import { useState } from "react";
import LessonsCard from "../LessonsCard/LessonsCard";
import styles from "./Lessons.module.css";
import cn from 'classnames';
import { Lesson } from "../../../helpers/API";

interface LessonsProps {
	courseId: string;
	onEditLesson: (lesson: Lesson) => void;
}

const Lessons: React.FC<LessonsProps> = ({ courseId, onEditLesson }) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasLessons, setHasLessons] = useState(false);

	const handleLessonsLoaded = (loaded: boolean, lessonsExist: boolean) => {
		setIsLoaded(loaded);
		setHasLessons(lessonsExist);
	}

	const numericCourseId = Number(courseId);

	if (isNaN(numericCourseId)) {
		return <div className={styles['error']}>Некорректный идентификатор курса</div>;
	}

	return (
		<div className={styles['lessons']}>
			{isLoaded && hasLessons && (
				<div className={styles['lessons__top']}>
					<div className={styles['lessons__first']}>
						<div className={cn(styles['lessons__method'], styles['caption'])}>Порядок</div>
						<div className={cn(styles['lessons__title'], styles['caption'])}>Название урока</div>
					</div>
					<div className={styles['lessons__last']}>
						<div className={cn(styles['lessons__date'], styles['caption'])}>Дата изменения</div>
					</div>
				</div>
			)}
			<div className={styles['lessons__body']}>
				<LessonsCard courseId={numericCourseId} onEditLesson={onEditLesson} onLessonLoader={handleLessonsLoaded} />
			</div>
		</div>
	)
}

export default Lessons;