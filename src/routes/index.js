import AccessDeniedPage from "../pages/AccessDenied/AccessDeniedPage";
import AdminPage from "../pages/AdminPage/AdminPage";
import CreateTimeSetPage from "../pages/CreateTimeSetPage/CreateTimeSetPage";
import HomePage from "../pages/HomePage/HomePage";
import SearchPage from "../pages/SearchPage/SearchPage";
import VerifyEmailPage from "../pages/VerifyEmail/VerifyEmailPage";

export const routes = [
    {
        path: "/",
        page: HomePage,
        showHeader: true,
        requiredScope: null,
    },
    {
        path: "/home/:id?",
        page: HomePage,
        showHeader: true,
        requiredScope: null,
    },
    {
        path: "/search",
        page: SearchPage,
        showHeader: true,
        requiredScope: null,
    },
    {
        path: "/admin",
        page: AdminPage,
        showHeader: false,
        requiredScope: "ROLE_ADMIN",
    },
    {
        path: "/createTimeSet",
        page: CreateTimeSetPage,
        showHeader: false,
        requiredScope: null,
    },
    {
        path: "/access-denied",
        page: AccessDeniedPage,
        showHeader: true,
        requiredScope: null,
    },
    {
        path: "/verify-email",
        page: VerifyEmailPage,
        showHeader: true,
        requiredScope: null,
    },
];
