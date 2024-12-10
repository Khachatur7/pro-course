import { Course } from "../../../hooks/useFormModal";
import Accordion, { HandleArchive } from "../../Accordion/Accordion";

interface CourseAccordionProps {
	course: Course;
	setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
	handleCourseUpdate: HandleArchive;
}

const CourseAccordion: React.FC<CourseAccordionProps> = ({ course, setCourses, handleCourseUpdate }) => (
	<Accordion
		id={course.id}
		title={course.name}
		status={course.status}
		contentTitle="Описание:"
		description={course.description}
		setCourses={setCourses}
		handleCourseUpdate={handleCourseUpdate}
	/>
);

export default CourseAccordion;