import { NavLink } from 'react-router-dom';
import styles from './Footer.module.css';

function Footer() {
	return (
		<footer className={styles['footer']}>
			<div className="wrapper">
				<div className={styles['footer__wrap']}>
					<div className={styles['menu']}>
						<NavLink to='/privacy-policy'>Политика конфиденциальности</NavLink>
						<NavLink to='/privacy-policy'>Публичная оферта</NavLink>
						<NavLink to='/privacy-policy'>Карта сайта</NavLink>
					</div>
					<div className={styles['develop']}>
						<NavLink to='/privacy-policy'>разработано в «Альфа»</NavLink>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer;