import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const OtpVerification = lazy(() => import("../pages/OtpVerification"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const UserMenuMobile = lazy(() => import("../pages/UserMenuMobile"));
const Dashboard = lazy(() => import("../admin/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const VerifyEmail = lazy(() => import("../pages/VerifyEmail"));
const AccountPrivacy = lazy(() => import("../pages/AccountPrivacy"));
const TermsAndConditions = lazy(() => import("../pages/legal/TermsConditions"));
const PrivacyPolicy = lazy(() => import("../pages/legal/PrivacyPolicy"));
const CancellationRefundPolicy = lazy(() => import("../pages/legal/CancellationRefundPolicy"));
const CookiePolicy = lazy(() => import("../pages/legal/CookiePolicy"));
const ContactUs = lazy(() => import("../pages/ContactUs"));

const AdminLayout = lazy(() => import("../components/AdminLayout"));
const DealerLayout = lazy(() => import("../components/DealerLayout"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const ManageUsers = lazy(() => import("../pages/ManageUsers"));
const AdminNotifications = lazy(() => import("../pages/AdminNotifications"));
const AdminApplications = lazy(() => import("../pages/AdminApplications"));
const AdminVehicleApprovals = lazy(() => import("../pages/AdminVehicleApprovals"));
const AdminBookings = lazy(() => import("../pages/AdminBookings"));
const AdminLegalPolicies = lazy(() => import("../pages/AdminLegalPolicies"));
const AdminSecurityMonitor = lazy(() => import("../pages/AdminSecurityMonitor"));

// Car Rental Pages
const CarsCatalog = lazy(() => import("../pages/CarsCatalog"));
const RentalShops = lazy(() => import("../pages/RentalShops"));
const RentalShopDetails = lazy(() => import("../pages/RentalShopDetails"));
const CarDetails = lazy(() => import("../pages/CarDetails"));
const BookingApprovalPortal = lazy(() => import("../pages/BookingApprovalPortal"));
const CustomerBookings = lazy(() => import("../pages/CustomerBookings"));
const Wishlist = lazy(() => import("../pages/Wishlist"));
const HowItWorks = lazy(() => import("../pages/HowItWorks"));

// Dealer Pages
const DealerOnboarding = lazy(() => import("../pages/DealerOnboarding"));
const DealerStatus = lazy(() => import("../pages/DealerStatus"));
const DealerDashboard = lazy(() => import("../pages/DealerDashboard"));
const DealerFleet = lazy(() => import("../pages/DealerFleet"));
const DealerAddCar = lazy(() => import("../pages/DealerAddCar"));
const DealerBookings = lazy(() => import("../pages/DealerBookings"));

// Agent Pages
const AgentOnboarding = lazy(() => import("../pages/AgentOnboarding"));
const AgentStatus = lazy(() => import("../pages/AgentStatus"));
const AgentDashboard = lazy(() => import("../pages/AgentDashboard"));

const router = createBrowserRouter([
    {
        path: "admin",
        element: <Navigate to="/admin-portal/dashboard" replace />
    },
    {
        path: "admin-portal",
        element: <AdminLayout />,
        children: [
            { index: true,               element: <Navigate to="dashboard" replace /> },
            { path: "dashboard",         element: <AdminDashboard /> },
            { path: "manage-users",      element: <ManageUsers /> },
            { path: "applications",      element: <AdminApplications /> },
            { path: "vehicle-approvals", element: <AdminVehicleApprovals /> },
            { path: "bookings",          element: <AdminBookings /> },
            { path: "notifications",     element: <AdminNotifications /> },
            { path: "security-monitor",  element: <AdminSecurityMonitor /> },
            { path: "legal-policies",    element: <AdminLegalPolicies /> },
            { path: "profile",           element: <Profile /> },
        ]
    },
    {
        path: "dealer",
        element: <DealerLayout />,
        children: [
            { index: true,        element: <Navigate to="dashboard" replace /> },
            { path: "dashboard",  element: <DealerDashboard /> },
            { path: "fleet",      element: <DealerFleet /> },
            { path: "cars/add",   element: <DealerAddCar /> },
            { path: "bookings",   element: <DealerBookings /> },
            { path: "status",     element: <DealerStatus /> },
            { path: "onboarding", element: <DealerOnboarding /> },
            { path: "profile",    element: <Profile /> },
        ]
    },
    {
        path: "/",
        element: <App />,
        children: [
            { path: "",                element: <Home /> },
            { path: "cars",            element: <CarsCatalog /> },
            { path: "bikes",           element: <Navigate to="/cars?vehicleType=bike" replace /> },
            { path: "how-it-works",    element: <HowItWorks /> },
            { path: "rental-shops",    element: <RentalShops /> },
            { path: "shop/:shopId",    element: <RentalShopDetails /> },
            { path: "car/:id",         element: <CarDetails /> },
            { path: "booking-approval/:bookingId", element: <BookingApprovalPortal /> },
            { path: "my-bookings",     element: <CustomerBookings /> },
            { path: "wishlist",        element: <Wishlist /> },

            // Agent Portal Routes
            { path: "agent/onboarding",  element: <AgentOnboarding /> },
            { path: "agent/status",      element: <AgentStatus /> },
            { path: "agent/dashboard",   element: <AgentDashboard /> },

            // General & Auth Routes
            { path: "terms-and-conditions", element: <TermsAndConditions /> },
            { path: "privacy-policy", element: <PrivacyPolicy /> },
            { path: "cancellation-refund-policy", element: <CancellationRefundPolicy /> },
            { path: "cookie-policy", element: <CookiePolicy /> },
            { path: "contact-us",        element: <ContactUs /> },
            { path: "login",             element: <Login /> },
            { path: "register",          element: <Register /> },
            { path: "forgot-password",   element: <ForgotPassword /> },
            { path: "verification-otp",  element: <OtpVerification /> },
            { path: "reset-password",    element: <ResetPassword /> },
            { path: "verify-email",      element: <VerifyEmail /> },
            { path: "user-menu",         element: <UserMenuMobile /> },

            // Customer Dashboard
            {
                path: "dashboard",
                element: <Dashboard />,
                children: [
                    { index: true,         element: <Navigate to="profile" replace /> },
                    { path: "profile",     element: <Profile /> },
                    { path: "my-bookings", element: <CustomerBookings /> },
                    { path: "wishlist",    element: <Wishlist /> },
                    { path: "privacy",     element: <AccountPrivacy /> },
                ]
            },
        ]
    },
]);

export default router;
