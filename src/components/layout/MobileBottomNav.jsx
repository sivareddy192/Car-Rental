import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home, Car, Compass, Map, User, Globe2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const MobileBottomNav = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Fleet', path: '/self-drive', icon: Car },
    { label: 'Taxi', path: '/taxi', icon: Compass },
    {
      label: 'Tours',
      path: '/tours',
      icon: Map,
    },
    {
      label: 'Account',
      path: isAuthenticated ? '/dashboard' : '/login',
      icon: User,
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-850 px-2 py-1.5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.5)] safe-area-pb"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-black dark:text-white font-bold'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                    {item.badge > 0 && (
                      <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] tracking-tight mt-0.5 font-medium">
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="mobileNavIndicator"
                      className="absolute -bottom-1 w-4 h-0.5 rounded-full bg-black dark:bg-white"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        <Link
          to="/nri-solutions"
          aria-label="NRI Solutions"
          className="flex flex-col items-center justify-center py-1 px-2.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          <Globe2 className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 font-medium">NRI</span>
        </Link>
      </div>
    </nav>
  );
};
