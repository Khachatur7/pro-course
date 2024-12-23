import { Outlet } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import styles from "./Marketplaces.module.css";

export function Marketplaces() {
	return (
		<div className={styles['courses']}>
			<Sidebar />
			<div className={styles['content']}>
				<Outlet />
			</div>
		</div>
	)
}

export default Marketplaces;
