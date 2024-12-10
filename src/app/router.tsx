import { createBrowserRouter } from "react-router-dom";
import Courses from "../pages/Courses/Courses";
import Settings from "../pages/Courses/Settings/Settings";
import Error from "../pages/Error/Error";
import { Login } from "../pages/Login/Login";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import Layout from "../layout/Layout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import CoursesPages from "../pages/Courses/CoursesPages/CoursesPages";
import MarketplacesServices from "../pages/Marketplaces/MarketplacesServices/MarketplacesServices";
import MarketplacesTemplates from "../pages/Marketplaces/MarketplacesTemplates/MarketplacesTemplates";
import Marketplaces from "../pages/Marketplaces/Marketplaces";
import { SchoolSettings } from "../pages/SchoolSettings/SchoolSettings";
import Expert from "../pages/Expert/Expert";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Используем Layout как корневой элемент
    children: [
      {
        path: "",
        element: (
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "",
            element: <CoursesPages />,
          },
          {
            path: "settings/:id",
            element: <Settings />,
          },
        ],
      },
      {
        path: "marketplaces",
        element: (
          <ProtectedRoute>
            <Marketplaces />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "services",
            element: <MarketplacesServices />,
          },
          {
            path: "templates",
            element: <MarketplacesTemplates />,
          },
        ],
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
        path: "school-settings",
        element: (
          <ProtectedRoute>
            <SchoolSettings />
          </ProtectedRoute>
        ),
      },
      {
        path: "error",
        element: <Error />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
    ],
  },
]);
