import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import HeaderAuth from './Header/HeaderAuth';
import Footer from './Footer/Footer';
import styles from './Layout.module.css';

function Layout() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    return (
        <>
            {isAuthenticated ? <HeaderAuth /> : undefined}
			<div className={styles['page']}>
				<div className="wrapper">
					<Outlet /> 
				</div>
			</div>
            <Footer />
        </>
    );
}

export default Layout;