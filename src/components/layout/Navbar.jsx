import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Crown,
  Heart,
  User,
  Menu,
  X,
  LogOut,
  Calendar,
  Shield,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice';
import { ThemeToggle } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Self Drive', path: '/self-drive' },
    { name: 'Taxi Service', path: '/taxi' },
    { name: 'Tour Packages', path: '/tours' },
    { name: 'NRI Solutions', path: '/nri-solutions' },
    { name: 'Wedding Cars', path: '/wedding-cars' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 py-3 shadow-md dark:shadow-xl'
          : 'bg-gradient-to-b from-white/90 via-white/40 to-transparent dark:from-black/80 dark:via-black/40 dark:to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" id="nav-brand-logo">
            
            <div className="flex flex-col">
              <span className="font-serif text-md tracking-[0.2em] font-bold text-zinc-950 dark:text-white uppercase group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
                Car Rental
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 text-xs uppercase tracking-wider font-medium transition-all duration-200 rounded-md ${
                    isActive
                      ? 'text-white bg-black dark:text-white dark:bg-zinc-800/80 font-semibold shadow-sm'
                      : 'text-zinc-700 hover:text-black hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900/60'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons, Theme Toggle & Auth */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Theme Toggle (Light / Dark mode selection) */}
            <ThemeToggle />

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              id="nav-wishlist-btn"
              className="relative p-2 text-zinc-700 hover:text-black hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white transition-colors rounded-full dark:hover:bg-zinc-800/60"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Authenticated Dropdown or Login Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  id="nav-user-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors text-xs text-zinc-900 dark:text-white"
                >
                  <div className="w-6 h-6 rounded-full bg-black text-white dark:bg-zinc-800 dark:text-zinc-200 flex items-center justify-center font-bold text-[11px]">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[100px] truncate font-medium">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-2 z-50 text-xs"
                    >
                      <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                        <p className="font-semibold text-zinc-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-zinc-500 dark:text-zinc-400 text-[11px] truncate">{user?.email}</p>
                        {user?.role === 'admin' && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300 text-[9px] font-semibold rounded uppercase tracking-wider">
                            Administrator
                          </span>
                        )}
                      </div>

                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <User className="w-4 h-4 text-zinc-400" />
                        Dashboard
                      </Link>

                      <Link
                        to="/dashboard/bookings"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-zinc-400" />
                        My Bookings
                      </Link>

                      <Link
                        to="/dashboard/settings"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-zinc-400" />
                        Profile Settings
                      </Link>

                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-amber-600 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-zinc-800 transition-colors font-medium border-t border-zinc-100 dark:border-zinc-800/80 my-1 pt-2"
                        >
                          <Shield className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                          Admin Console
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors border-t border-zinc-100 dark:border-zinc-800 mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  id="nav-login-btn"
                  className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-700 hover:text-black dark:text-zinc-200 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />

            <Link
              to="/wishlist"
              className="relative p-2 text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              id="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-800 hover:text-black dark:text-zinc-300 dark:hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/98 text-zinc-900 border-b border-zinc-200 dark:bg-zinc-950/95 dark:text-zinc-100 dark:border-zinc-800 backdrop-blur-xl px-5 pt-4 pb-6 shadow-xl"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="py-2.5 text-sm font-medium uppercase tracking-wider text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white border-b border-zinc-100 dark:border-zinc-900"
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 flex flex-col space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="py-2 text-xs text-zinc-500 dark:text-zinc-400">
                      Logged in as <span className="text-black dark:text-white font-medium">{user?.email}</span>
                    </div>
                    <Link
                      to="/dashboard"
                      className="py-2 text-sm text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white flex items-center gap-2"
                    >
                      <User className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link
                      to="/dashboard/bookings"
                      className="py-2 text-sm text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" /> My Bookings
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="py-2 text-sm text-amber-600 dark:text-amber-300 flex items-center gap-2 font-semibold"
                      >
                        <Shield className="w-4 h-4" /> Admin Console
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="py-2 text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2 text-left"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-1 gap-3 pt-2">
                    <Link
                      to="/login"
                      className="py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-zinc-800 bg-zinc-100 border border-zinc-200 dark:text-zinc-200 dark:bg-zinc-900 dark:border-zinc-700 rounded"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
