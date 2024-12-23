import { useEffect, useState } from 'react';
import Headling from '../../../components/Headling/Headling';
import styles from './OrdersPage.module.css';
import OrdersList from '../OrdersList/OrdersList';
import { Form, getForms } from '../../../api/orders';
import OrdersCard from '../../../components/Orders/OrdersCard/OrdersCard';

const OrdersPage = () => {
	const [forms, setForms] = useState<Form[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const userRole = localStorage.getItem('role');

	useEffect(() => {
		const fetchForms = async () => {
			try {
				const fetchedForms = await getForms();
				setForms(fetchedForms);
			} catch (error: unknown) {
				if (error instanceof Error) {
				setError(error.message);
				} else {
				setError('Неизвестная ошибка');
				}
			} finally {
				setLoading(false);
			}
		};
	
		fetchForms();
	}, []);

	if (loading) {
		return (
			<div className={styles['loading']}>
				<svg xmlns="http://www.w3.org/2000/svg" width="120" height="30" viewBox="0 0 120 30" fill="#0050ff">
					<circle cx="15" cy="15" r="12">
						<animate attributeName="r" from="12" to="12" begin="0s" dur="0.8s" values="12;9;12" calcMode="linear" repeatCount="indefinite" />
						<animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite" />
					</circle>
					<circle cx="60" cy="15" r="9" fillOpacity="0.5">
						<animate attributeName="r" from="9" to="9" begin="0.2s" dur="0.8s" values="9;12;9" calcMode="linear" repeatCount="indefinite" />
						<animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0.2s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite" />
					</circle>
					<circle cx="105" cy="15" r="9" fillOpacity="0.5">
						<animate attributeName="r" from="9" to="9" begin="0.4s" dur="0.8s" values="9;12;9" calcMode="linear" repeatCount="indefinite" />
						<animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0.4s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite" />
					</circle>
				</svg>
			</div>
		);
	}

	if(userRole === "student") {
		return (
			<>Раздел в разработке</>
		);
	}

	if (error) {
		return <div>Ошибка: {error}</div>;
	}

	return (
		<div className={styles['orders']}>
			<div className={styles['orders__top']}>
				<Headling appearance="big">Список форм</Headling>
			</div>
			{forms.length > 0 ? (
				<OrdersList forms={forms} setForms={setForms} />
			) : (
				<OrdersCard
				title="Создайте форму"
				description={`
					<ul>
					<li>Здесь будут отображаться все формы школы</li>
					<li>Можно создать свою собственную форму или выбрать из готовых шаблонов</li>
					<li>Любую форму вы сможете отредактировать и настроить под себя</li>
					</ul>
				`}
				setForms={setForms}
				/>
			)}
		</div>
	);
};

export default OrdersPage;
