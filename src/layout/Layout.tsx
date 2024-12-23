import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import HeaderAuth from './Header/HeaderAuth';
import Footer from './Footer/Footer';
import styles from './Layout.module.css';

function Layout() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
	const location = useLocation();
	const hideHeaderFooter = location.pathname.startsWith('/forms/') && location.pathname.includes('/share');

    return (
        <>
            {!hideHeaderFooter && isAuthenticated && <HeaderAuth />}
			<div className={styles['page']}>
				<div className="wrapper">
					<Outlet /> 
				</div>
			</div>
            {!hideHeaderFooter && <Footer />}
        </>
    );
}

export default Layout;