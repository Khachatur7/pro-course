import { Dispatch, SetStateAction, useState } from 'react';
import Button from '../../Button/Button';
import styles from './CoursesCard.module.css';
import { Course } from '../../../hooks/useFormModal';
import CourseModal from '../CourseModal/CourseModal';

interface CoursesCardProps {
	title: string;
	description: string;
	onDelete: () => void;
	onCreate?: (course: { title: string; description: string }) => void;
	setCourses: Dispatch<SetStateAction<Course[]>>;
}

const CoursesCard: React.FC<CoursesCardProps> = ({ title, description, onDelete, setCourses }) => {
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
						<Button onClick={() => setIsModalOpen(true)} appearance="big" type="submit">Создать курс</Button>
						<Button onClick={onDelete} appearance="item" type="submit">Выбрать шаблон</Button>
					</div>
				</div>
			</div>
			<CourseModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				setCourses={setCourses}
			/>
		</>
	);
};

export default CoursesCard;