import { NavLink } from 'react-router-dom';
import styles from './Footer.module.css';

function Footer() {
	return (
		<footer className={styles['footer']}>
			<div className="wrapper">
				<div className={styles['footer__wrap']}>
					<div className={styles['menu']}>
						<NavLink to='/privacy-policy'>Политика конфиденциальности</NavLink>
						<a href='/instruktsiya.pdf' target='_blank'>Инструкция</a>
						<NavLink to='/privacy-policy'>Карта сайта</NavLink>
					</div>
					<div className={styles['develop']}>
						<a href='https://ag-group.tech/' target="_blank">Разработано в "AG-Group"</a>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer;