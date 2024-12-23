import { NavLink } from 'react-router-dom';
import Headling from '../../components/Headling/Headling';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import styles from './InProgress.module.css';

const InProgress = () => {
	return (
		<div className={styles['progress']}>
			<Sidebar />
			<div className={styles['progress__wrap']}>
				<div className={styles['progress__img']}>
					<img src="/in-progress.png" alt="" />
				</div>
				<div className={styles['progress__box']}>
					<Headling appearance='small'>Раздел в разработке</Headling>
					<div className={styles['desc']}>Совсем скоро мы добавим его на платформу</div>
					<NavLink to={"/"} className={styles['btn']}>На главную</NavLink>
				</div>
			</div>
		</div>
	)
}

export default InProgress;