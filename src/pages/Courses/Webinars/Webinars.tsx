import Headling from '../../../components/Headling/Headling';
import { CourseList } from '../../../components/Courses';
import styles from './Webinar.module.css';

const Webinar = () => {
	return(
		<div>
			<div className={styles['courses-list']}>
				<Headling appearance='big'>Формы</Headling>
				<CourseList />
			</div>
		</div>
	)
}

export default Webinar;