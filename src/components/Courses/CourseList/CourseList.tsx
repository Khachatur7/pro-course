import styles from './CourseList.module.css';
import CoursesCard from "../CoursesCard/CoursesCard";
import { useState } from 'react';
import { Course } from '../../../hooks/useFormModal';

const CourseList = () => {
	const [courses, setCourses] = useState<Course[]>([]);
	const handleDelete = () => {
		console.log(courses)
	};

	return (
		<div className={styles["courses-list"]}>
			<CoursesCard
				title="Создайте свой первый курс сейчас!"
				description={`
				<ul>
					<li>На этой странице будут отображаться все созданные вами курсы</li>
					<li>Вы сможете перейти к редактированию курса, нажав на нужный курс!</li>
					<li>Можно создать свой собственный курс или выбрать шаблон готового курса</li>
				</ul>
				`}
				onDelete={handleDelete}
				setCourses={setCourses}
			/>
		</div>
	);
};

export default CourseList;
