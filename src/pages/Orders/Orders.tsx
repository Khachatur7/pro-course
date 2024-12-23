import { Outlet } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import styles from "./Orders.module.css";

const Orders = () => {
	return (
		<div className={styles['orders']}>
			<Sidebar />
			<div className={styles['content']}>
				<Outlet />
			</div>
		</div>
	)
}

export default Orders;