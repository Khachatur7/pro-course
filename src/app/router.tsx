import { createBrowserRouter } from 'react-router-dom';
import Courses from '../pages/Courses/Courses';
import Settings from '../pages/Courses/Settings/Settings';
import Error from '../pages/Error/Error';
import { Login } from '../pages/Login/Login';
import Layout from '../layout/Layout';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import CoursesPages from '../pages/Courses/CoursesPages/CoursesPages';
import MarketplacesServices from '../pages/Marketplaces/MarketplacesServices/MarketplacesServices';
import MarketplacesTemplates from '../pages/Marketplaces/MarketplacesTemplates/MarketplacesTemplates';
import Marketplaces from '../pages/Marketplaces/Marketplaces';
import { SchoolSettings } from '../pages/SchoolSettings/SchoolSettings';
import LessonPreview from '../pages/Courses/LessonPreview/LessonPreview';
import Expert from "../pages/Expert/Expert";
import Orders from '../pages/Orders/Orders';
import OrdersPages from '../pages/Orders/OrdersPage/OrdersPages';
import OrdersSettings from '../pages/Orders/OrdersSettings/OrdersSettings';
import InProgress from '../pages/InProgress/InProgress';
import OrderPreview from '../pages/Orders/OrderPreview/OrderPreview';
import FormShare from '../pages/FormShare/FormShare';
import Payment from '../pages/Payment/Payment';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,  // Используем Layout как корневой элемент
        children: [
            {
                path: '',
                element: (
                    <ProtectedRoute>
                        <Courses />
                    </ProtectedRoute>
                ),
				children: [
					{
						path: '',
						element: <CoursesPages />
					},
					{
						path: 'settings/:id',
						element: <Settings />
					},
                    {
                        path: 'course/:courseId/lesson/:lessonId',
                        element: <LessonPreview />,
                    },
				]
            },
			{
				path: 'orders',
				element: (
					<ProtectedRoute>
						<Orders />
					</ProtectedRoute>
				),
				children: [
					{
						path: '',
						element: <OrdersPages />
					},
					{
						path: ':id/settings',
						element: <OrdersSettings />
					}
				]
			},
            {
                path: 'marketplaces',
                element: (
                    <ProtectedRoute>
                        <Marketplaces />
                    </ProtectedRoute>
                ),
				children: [
					{
						path: 'services',
						element: <MarketplacesServices />
					},
					{
						path: 'templates',
						element: <MarketplacesTemplates />
					},
				]
            },
			{
				path: 'orders/:id/preview',
				element: (
					<ProtectedRoute>
						<OrderPreview />
					</ProtectedRoute>
				),
			},
			{
				path: "expert/:id",
				element: (
					<ProtectedRoute>
						<Expert />
					</ProtectedRoute>
				),
			},
			{
				path: 'school-settings',
				element: (
					<ProtectedRoute>
						<SchoolSettings />
					</ProtectedRoute>
				)
			},
            {
                path: 'error',
                element: <Error />,
            },
			{
				path: 'progress',
				element: (
					<ProtectedRoute>
						<InProgress />
					</ProtectedRoute>
				)
			},
			{
				path: 'progress1',
				element: (
					<ProtectedRoute>
						<InProgress />
					</ProtectedRoute>
				)
			},
			{
				path: 'progress2',
				element: (
					<ProtectedRoute>
						<InProgress />
					</ProtectedRoute>
				)
			},
			{
				path: 'progress3',
				element: (
					<ProtectedRoute>
						<InProgress />
					</ProtectedRoute>
				)
			},
			{
				path: 'progress4',
				element: (
					<ProtectedRoute>
						<InProgress />
					</ProtectedRoute>
				)
			},
			{
				path: 'progress5',
				element: (
					<ProtectedRoute>
						<InProgress />
					</ProtectedRoute>
				)
			},
			{
				path: 'progress6',
				element: (
					<ProtectedRoute>
						<InProgress />
					</ProtectedRoute>
				)
			},
			{
				path: 'progress7',
				element: (
					<ProtectedRoute>
						<InProgress />
					</ProtectedRoute>
				)
			},
			{
				path: 'progress8',
				element: (
					<ProtectedRoute>
						<InProgress />
					</ProtectedRoute>
				)
			},
			{
				path: 'progress9',
				element: (
					<ProtectedRoute>
						<InProgress />
					</ProtectedRoute>
				)
			},
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'privacy-policy',
                element: <InProgress />,
            },
			{
				path: 'forms/:id/share',
				element: <FormShare />
			}
        ],
    },
	{
		path: '/pay/:curseId/:offerId',
        element: <Payment />,  
	}
]);