import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home, Car, Bike, HelpCircle, User } from 'lucide-react';

const BottomNavigationBar = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const user = useSelector(state => state.user);

    const vehicleTypeParam = searchParams.get("vehicleType");

    const isHomeActive = location.pathname === '/';
    const isCarsActive = location.pathname === '/cars' && (!vehicleTypeParam || vehicleTypeParam === 'car');
    const isBikesActive = location.pathname === '/cars' && vehicleTypeParam === 'bike';
    const isHowItWorksActive = location.pathname.startsWith('/how-it-works');
    const isProfileActive = 
        location.pathname.startsWith('/dashboard') ||
        location.pathname.startsWith('/user-menu') ||
        location.pathname === '/login' ||
        location.pathname === '/register';

    const profilePath = user?._id 
        ? (user.role === 'dealer' ? '/dealer/dashboard' : (user.role === 'admin' ? '/admin-portal/dashboard' : '/dashboard/profile'))
        : '/login';

    const navItems = [
        {
            id: 'home',
            label: 'Home',
            path: '/',
            icon: Home,
            active: isHomeActive
        },
        {
            id: 'cars',
            label: 'Cars',
            path: '/cars?vehicleType=car',
            icon: Car,
            active: isCarsActive
        },
        {
            id: 'bikes',
            label: 'Bikes',
            path: '/cars?vehicleType=bike',
            icon: Bike,
            active: isBikesActive
        },
        {
            id: 'how-it-works',
            label: 'How It Works',
            path: '/how-it-works',
            icon: HelpCircle,
            active: isHowItWorksActive
        },
        {
            id: 'profile',
            label: 'Profile',
            path: profilePath,
            icon: User,
            active: isProfileActive
        }
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 transition-colors duration-300">
            <div className="flex h-16 items-center justify-around px-1 max-w-lg mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className="flex-1 flex flex-col items-center justify-center gap-1 group transition-colors h-full select-none"
                        >
                            <div className={`p-1 transition-transform duration-200 ${
                                item.active 
                                    ? 'text-amber-700 dark:text-amber-400 scale-105' 
                                    : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'
                            }`}>
                                <Icon className="w-5 h-5" strokeWidth={item.active ? 2.5 : 2} />
                            </div>
                            <span className={`text-[10px] font-semibold whitespace-nowrap transition-colors ${
                                item.active 
                                    ? 'text-amber-700 dark:text-amber-400 font-bold' 
                                    : 'text-slate-600 dark:text-slate-400'
                            }`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
            {/* Active accent bar */}
            <div className="h-0.5 bg-amber-500 w-full" />
        </nav>
    );
};

export default BottomNavigationBar;
