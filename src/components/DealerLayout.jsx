import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, Navigate, NavLink, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setUserDetails } from '../store/userSlice';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast, { Toaster } from 'react-hot-toast';
import fetchUserDetails from '../utils/fetchUserDetails';
import { TableSkeleton } from './dashboard/DashboardSkeleton';
import {
    LayoutDashboard as LuLayoutDashboard,
    Car as LuCar,
    CalendarCheck as LuCalendarCheck,
    Plus as LuPlus,
    Store as LuStore,
    User as LuUser,
    LogOut as LuLogOut,
    Menu as LuMenu,
    X as LuX,
    Sparkles as LuSparkles,
    ShieldCheck as LuShieldCheck,
    TrendingUp as LuTrendingUp,
} from 'lucide-react';
import { ThemeToggle } from '../provider/ThemeProvider';
import NotificationBell from './NotificationBell';
import CookieConsentBanner from './cookie/CookieConsentBanner';
import CookiePreferenceModal from './cookie/CookiePreferenceModal';

const navSections = [
    {
        group: 'Overview',
        items: [
            { to: '/dealer/dashboard', icon: <LuLayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
            { to: '/dealer/bookings',  icon: <LuCalendarCheck className="w-4 h-4" />,  label: 'Booking Requests' },
        ],
    },
    {
        group: 'Fleet Management',
        items: [
            { to: '/dealer/fleet',    icon: <LuCar className="w-4 h-4" />,  label: 'My Fleet' },
            { to: '/dealer/cars/add', icon: <LuPlus className="w-4 h-4" />, label: 'Add Vehicle' },
        ],
    },
    {
        group: 'Store & Account',
        items: [
            { to: '/dealer/status',  icon: <LuStore className="w-4 h-4" />, label: 'Dealer Status' },
            { to: '/dealer/profile', icon: <LuUser className="w-4 h-4" />,  label: 'My Profile' },
        ],
    },
];

const DealerSidebar = ({ user, onClose, onLogout }) => {
    const displayName = user?.name || user?.email || 'Dealer';
    const initial = displayName?.charAt(0)?.toUpperCase() || 'D';

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            isActive
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
        }`;

    return (
        <aside className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors">
            {/* Brand Header */}
            <Link to="/dealer/dashboard" className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black">
                    <LuCar className="w-4 h-4" />
                </div>
                <div>
                    <span className="font-black text-base tracking-tight uppercase text-slate-950 dark:text-white block leading-none">
                        DRIVE<span className="text-blue-600">RENT</span>
                    </span>
                    <span className="text-[9px] tracking-widest uppercase font-bold text-slate-400 block mt-0.5">
                        Dealer Console
                    </span>
                </div>
            </Link>

            {/* Navigation links – grouped */}
            <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-5">
                {navSections.map((section) => (
                    <div key={section.group}>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3 mb-1.5">
                            {section.group}
                        </p>
                        <div className="space-y-0.5">
                            {section.items.map(item => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={navLinkClass}
                                    onClick={onClose}
                                >
                                    {item.icon}
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Profile & Logout */}
            <div className="px-4 pb-6 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm">
                        {initial}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-900 dark:text-white">{displayName}</p>
                        <p className="truncate text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase">Authorized Dealer</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                >
                    <LuLogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

const DealerLayout = () => {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [authChecking, setAuthChecking] = useState(true);

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const verifyDealer = async () => {
            if (!token) {
                setAuthChecking(false);
                return;
            }

            if (!user?._id) {
                try {
                    const userData = await fetchUserDetails();
                    if (userData?.success && userData.data) {
                        dispatch(setUserDetails(userData.data));
                    }
                } catch (e) {
                    console.error("DealerLayout user fetch failed", e);
                }
            }
            setAuthChecking(false);
        };

        verifyDealer();
    }, [token, user?._id, dispatch]);

    // While verifying authentication on cold reload
    if (authChecking && !user?._id && token) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] flex items-center justify-center p-6 text-slate-800 dark:text-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Verifying dealer access...</p>
                </div>
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" replace state={{ from: { pathname: '/dealer/dashboard' } }} />;
    }

    const handleLogout = async () => {
        try {
            const res = await Axios({ ...SummaryApi.logout });
            if (res?.data?.success) {
                dispatch(logout());
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                toast.success('Logged out successfully');
                navigate('/login');
            }
        } catch {
            toast.error('Logout failed');
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:w-72 lg:flex-col lg:shrink-0">
                <DealerSidebar user={user} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="relative flex w-72 max-w-[85vw] flex-1 flex-col">
                        <DealerSidebar user={user} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Header */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 sm:px-6 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 lg:hidden cursor-pointer"
                        >
                            <LuMenu className="w-5 h-5" />
                        </button>
                        <span className="text-xs font-bold text-slate-400 hidden sm:inline-block">
                            DriveRent Dealer Fleet Console
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <NotificationBell />
                        <Link
                            to="/dealer/cars/add"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
                        >
                            <LuPlus className="w-3.5 h-3.5" />
                            Add Vehicle
                        </Link>
                    </div>
                </header>

                {/* Page Content Viewport */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Suspense fallback={<TableSkeleton rows={6} cols={5} />}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>

            <Toaster position="top-right" />
            <CookieConsentBanner />
            <CookiePreferenceModal />
        </div>
    );
};

export default DealerLayout;

