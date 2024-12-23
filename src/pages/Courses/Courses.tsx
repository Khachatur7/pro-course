import { Outlet } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import styles from "./Courses.module.css";

function Courses() {
	return (
		<div className={styles['courses']}>
			<Sidebar />
			<div className={styles['content']}>
				<Outlet />
			</div>
		</div>
	)
}

export default Courses;
