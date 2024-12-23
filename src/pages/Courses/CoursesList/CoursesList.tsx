import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Tabs from "../../../components/Tabs/Tabs";
import CourseAccordion from "../../../components/Courses/CourseAccordion/CourseAccordion";
import styles from "./CoursesList.module.css";
import Button from "../../../components/Button/Button";
import { Course } from "../../../hooks/useFormModal";
import { updateCourseStatus } from "../../../helpers/API";
import Vendor from "../../../components/Vendor/Vendor";
import cn from 'classnames';
import CourseModal from "../../../components/Courses/CourseModal/CourseModal";

interface CorsesListProps {
	courses: Course[];
	setCourses: Dispatch<SetStateAction<Course[]>>;
}

const CoursesList: React.FC<CorsesListProps> = ({ courses, setCourses }) => {
	const [activeTab, setActiveTab] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [vendorActive, setVendorActive] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const userRole = localStorage.getItem('role');

	useEffect(() => {
        if (message || error) {
            setVendorActive(true);
            const timer = setTimeout(() => setVendorActive(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, error]);

	useEffect(() => {
		console.log("Courses:", courses);
	}, [courses]);

	const handleCourseUpdate = async (id: number, newStatus: number, title: string) => {
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

	const handleTabClick = (index: number) => setActiveTab(index);

	const filteredCourses = courses
		.filter(course => {
			if(userRole === "student") {
				return course.status === "Опубликовано";
			}
			if (activeTab === 0) return course.status === 'Опубликовано';
			if (activeTab === 1) return course.status === 'В архиве';
			return false;
		})
		.filter((course, index, self) => 
			self.findIndex((c) => c.id === course.id) === index
		);

	return (
		<div className={styles['content']}>
			
            <Vendor className={cn({ [styles.active]: vendorActive })}>
                {message && <p>{message}</p>}
                {error && <p>{error}</p>}
            </Vendor>
			
			<div className={styles["courses-list"]}>
				{userRole !== "student" && (
					<div className={styles["courses-list__top"]}>
						<Tabs
							tabs={["Текущие", "Архивные"]}
							activeTab={activeTab}
							onTabClick={handleTabClick}
						/>
						<Button appearance="big" onClick={() => setIsModalOpen(true)}>Создать курс</Button>
					</div>
				)}
				<div className={styles["courses-list__content"]}>
					{activeTab === 1 && filteredCourses.length === 0 ? (
						<>Архив пуст</>
					) : (
						filteredCourses.map((course) => (
							<CourseAccordion 
								key={course.id} 
								course={course} 
								handleCourseUpdate={handleCourseUpdate} 
								setCourses={setCourses}
							/> 
						))
					)}
				</div>
				{userRole !== "student" && (
					<CourseModal
						isOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
						setCourses={setCourses}
					/>
				)}
			</div>
		</div>
	);
};

export default CoursesList;
