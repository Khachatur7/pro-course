import { CoursesCard } from '../../../components/Courses';
import Headling from '../../../components/Headling/Headling';
import styles from './CoursesPages.module.css';
import CoursesList from '../CoursesList/CoursesList';	
import { useEffect, useState } from 'react';
import { Course } from '../../../hooks/useFormModal';
import { getCourses } from '../../../helpers/API';

const CoursesPages = () => {
	
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const userRole = localStorage.getItem('role');

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const fetchCourses = await getCourses();
				console.log('Полученные курсы:', fetchCourses);
				setCourses(fetchCourses);
			} catch (error: unknown) {
				if(error instanceof Error) {
					setError(error.message);
				} else {
					setError('Неизвестная ошибка');
				}
			} finally {
				setLoading(false);
			}
		};

		fetchCourses();
	}, [userRole]);

	if(loading) {
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
	}

	if(error) {
		return <div>Ошибка: {error}</div>
	}

	return(
		<div className={styles['courses-list']}>
			<Headling appearance='big'>Список курсов</Headling>
			{userRole  === 'student' ? (
				courses.length > 0 ? (
					<CoursesList courses={courses} setCourses={setCourses} />
				) : (
					<div className={styles['no-courses']}>
						<p>Курсов нет!</p>
					</div>
				)
			) : courses.length > 0 ? (
				<CoursesList courses={courses} setCourses={setCourses} />
			) : (
				<CoursesCard
					title="Создайте свой первый курс сейчас!"
					description={`
					<ul>
						<li>На этой странице будут отображаться все созданные вами курсы</li>
						<li>Вы сможете перейти к редактированию курса, нажав на нужный курс!</li>
						<li>Можно создать свой собственный курс или выбрать шаблон готового курса</li>
					</ul>
					`}
					onDelete={() => console.log('Шаблон нельзя удалить')}
					setCourses={setCourses}
				/>
			)}
		</div>
	);
}

export default CoursesPages;