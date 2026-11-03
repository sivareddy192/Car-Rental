import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { 
  Car, 
  Bike, 
  Compass, 
  Store, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles, 
  User, 
  LogIn, 
  UserPlus, 
  Menu, 
  X, 
  LogOut, 
  CalendarCheck, 
  Home,
  ChevronRight,
  Heart
} from 'lucide-react';
import UserMenu from './UserMenu'
import { getImageUrl } from '../utils/getImageUrl'
import { ThemeToggle, useTheme } from '../provider/ThemeProvider'
import NotificationBell from './NotificationBell'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { isDark } = useTheme()
  const user = useSelector((state) => state?.user)
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setOpenUserMenu(false)
      }
    }

    if (openUserMenu) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openUserMenu])

  // Close mobile drawer on route change (React recommended render-time adjustment)
  const currentLocKey = location.pathname + location.search
  const [prevLocKey, setPrevLocKey] = useState(currentLocKey)
  if (prevLocKey !== currentLocKey) {
    setPrevLocKey(currentLocKey)
    if (mobileDrawerOpen) {
      setMobileDrawerOpen(false)
    }
  }

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileDrawerOpen])

  const handleLogout = async () => {
    try {
      const response = await Axios({ ...SummaryApi.logout })
      if (response?.data?.success) {
        setMobileDrawerOpen(false)
        dispatch(logout())
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        toast.success("Logged out successfully.")
        navigate('/')
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const userRole = (user?.role || "").toLowerCase()
  const isDealer = userRole === "dealer"
  const isAgent = userRole === "agent"
  const isAdmin = userRole === "admin"

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Cars", path: "/cars?vehicleType=car", icon: Car },
    { name: "Bikes", path: "/cars?vehicleType=bike", icon: Bike },
    { name: "Rental Shops", path: "/rental-shops", icon: Store },
    { name: "How It Works", path: "/how-it-works", icon: HelpCircle, hideOnTablet: true },
    { name: "Support", path: "/contact-us", icon: Compass, hideOnTablet: true }
  ]

  return (
    <>
      <header className='h-20 bg-white dark:bg-slate-900 fixed top-0 w-full z-50 flex flex-col justify-center border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300'>
        <div className='container mx-auto px-4 lg:px-8'>
          <div className='flex items-center justify-between h-20 gap-4'>

            {/* DriveRent Brand Logo */}
            <Link to="/" className='flex items-center gap-2.5 shrink-0 group'>
              <div className='w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white transition-all duration-200 group-hover:scale-105'>
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
                  <circle cx="7.5" cy="14.5" r="1.5"/>
                  <circle cx="16.5" cy="14.5" r="1.5"/>
                </svg>
              </div>
              <span className='font-black text-2xl tracking-tight text-slate-900 dark:text-white uppercase font-heading block leading-none'>
                Drive<span className='text-blue-600 dark:text-blue-500'>Rent</span>
              </span>
            </Link>

            {/* Navigation Links (Tablet md & Desktop lg/xl) */}
            <nav className='hidden md:flex items-center gap-1 lg:gap-1.5 xl:gap-2'>
              {navLinks.map((item) => {
                const active = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path))
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all ${
                      item.hideOnTablet ? "hidden lg:flex" : "flex"
                    } items-center gap-1.5 ${
                      active
                        ? "text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/40"
                        : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-rose-500 to-amber-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}

              {/* Special Role Hub shortcuts on Tablet & Desktop */}
              {isDealer && (
                <Link
                  to={user?.onboardingStatus === "approved" ? "/dealer/dashboard" : (user?.onboardingStatus === "submitted" ? "/dealer/status" : "/dealer/onboarding")}
                  className='px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-xl text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 transition-all flex items-center gap-1.5'
                >
                  <Sparkles className='w-3.5 h-3.5' />
                  <span>Dealer Hub</span>
                </Link>
              )}

              {isAgent && (
                <Link
                  to={user?.onboardingStatus === "approved" ? "/agent/dashboard" : (user?.onboardingStatus === "submitted" ? "/agent/status" : "/agent/onboarding")}
                  className='px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 transition-all flex items-center gap-1.5'
                >
                  <ShieldCheck className='w-3.5 h-3.5' />
                  <span>Agent Hub</span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin-portal/dashboard"
                  className='px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 transition-all flex items-center gap-1.5'
                >
                  <ShieldCheck className='w-3.5 h-3.5' />
                  <span>Admin Portal</span>
                </Link>
              )}
            </nav>

            {/* Right Action Icons: Theme Toggle, Notifications, Account & Three-Bar Menu Button */}
            <div className='flex items-center gap-2 sm:gap-3'>

              {/* Theme Switcher Button */}
              <ThemeToggle />

              {/* In-App Notifications (when user logged in) */}
              {user?._id && <NotificationBell />}

              {/* Desktop User Profile Menu or Login/Register Buttons */}
              {user?._id ? (
                <div className='relative hidden sm:block' ref={userMenuRef}>
                  <button
                    type='button'
                    onClick={() => setOpenUserMenu(prev => !prev)}
                    aria-label={`${user.name || 'Account'} menu`}
                    className='flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all hover:border-blue-500 active:scale-95'
                  >
                    {user.avatar ? (
                      <img
                        alt={user.name || 'User'}
                        src={getImageUrl(user.avatar, { width: 80, quality: 75 })}
                        width="40"
                        height="40"
                        className='h-full w-full rounded-xl object-cover'
                      />
                    ) : (
                      <div className='w-full h-full bg-blue-600 text-white font-black text-sm flex items-center justify-center'>
                        {(user.name || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {openUserMenu && (
                    <div className='absolute right-0 top-12 w-64 animate-in fade-in zoom-in-95 duration-150 z-50'>
                      <UserMenu close={() => setOpenUserMenu(false)} />
                    </div>
                  )}
                </div>
              ) : (
                <div className='hidden sm:flex items-center gap-2'>
                  <Link
                    to="/login"
                    className='px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className='px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all active:scale-95'
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Three-Bar Hamburger Menu Button (☰) on Top for Mobile Phone only (< md screen) */}
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(prev => !prev)}
                aria-label="Toggle navigation menu"
                className="md:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 cursor-pointer flex items-center justify-center bg-slate-50 dark:bg-slate-900"
              >
                {mobileDrawerOpen ? (
                  <X className="w-6 h-6 text-slate-900 dark:text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-900 dark:text-white" />
                )}
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer mounted via React Portal into document.body to ensure 100% solid, fully opaque backdrop & panel */}
      {mobileDrawerOpen && typeof document !== 'undefined' && createPortal(
        <div className="md:hidden fixed inset-0 z-[99999] isolate" role="dialog" aria-modal="true">
          
          {/* Deep Dark Backdrop Overlay */}
          <div 
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(2, 6, 23, 0.85)' }}
          />

          {/* 100% Solid, Fully Opaque Drawer Panel */}
          <div 
            className="fixed top-0 right-0 bottom-0 w-[310px] sm:w-[350px] max-w-[85vw] h-full h-dvh text-slate-900 dark:text-slate-100 border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-y-auto z-[100000] drawer-slide-in"
            style={{ 
              backgroundColor: isDark ? '#111622' : '#ffffff',
              opacity: 1
            }}
          >
            
            {/* Drawer Top Header & Navigation Content */}
            <div className="flex-1 overflow-y-auto" style={{ backgroundColor: isDark ? '#111622' : '#ffffff' }}>
              
              {/* Drawer Top Bar */}
              <div 
                className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 z-10"
                style={{ backgroundColor: isDark ? '#111622' : '#ffffff' }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white uppercase font-heading block leading-none">
                      Drive<span className="text-blue-600">Rent</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Car &amp; Bike Rentals</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition active:scale-90"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Summary Card or Guest Login / Register */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
                {user?._id ? (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3">
                    {user.avatar ? (
                      <img
                        src={getImageUrl(user.avatar)}
                        alt={user.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-black text-base flex items-center justify-center shrink-0">
                        {(user.name || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name || "User"}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                        isDealer ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400" :
                        isAdmin ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400" :
                        isAgent ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-400" :
                        "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400"
                      }`}>
                        {user.role || "Customer"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Welcome to DriveRent</p>
                    <div className="flex items-center gap-2">
                      <Link
                        to="/login"
                        onClick={() => setMobileDrawerOpen(false)}
                        className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center"
                      >
                        Log In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileDrawerOpen(false)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold text-center hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* If User is Logged In: Show ONLY My Profile, My Bookings, Wishlist Cars & Bikes */}
              {user?._id ? (
                <div className="p-3 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Account Dashboard
                  </div>

                  <Link
                    to="/dashboard/profile"
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                      location.pathname === '/dashboard/profile'
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <User className="w-4 h-4 text-blue-600" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/dashboard/my-bookings"
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                      location.pathname === '/dashboard/my-bookings' || location.pathname === '/my-bookings'
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <CalendarCheck className="w-4 h-4 text-amber-500" />
                    <span>My Bookings</span>
                  </Link>

                  <Link
                    to="/dashboard/wishlist"
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                      location.pathname === '/dashboard/wishlist' || location.pathname === '/wishlist'
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                    <span>Wishlist Cars &amp; Bikes</span>
                  </Link>
                </div>
              ) : (
                /* Guest Navigation Links (when not logged in) */
                <div className="p-3 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Navigation
                  </div>

                  <Link
                    to="/"
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                      location.pathname === '/' 
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Home</span>
                  </Link>

                  <Link
                    to="/cars?vehicleType=car"
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                      location.pathname === '/cars' && (!location.search || location.search.includes('vehicleType=car'))
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Car className="w-4 h-4 text-blue-600" />
                    <span>Rent Cars</span>
                  </Link>

                  <Link
                    to="/cars?vehicleType=bike"
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                      location.pathname === '/cars' && location.search.includes('vehicleType=bike')
                        ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 font-bold' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Bike className="w-4 h-4 text-amber-500" />
                      <span>Bikes</span>
                    </div>
                  </Link>

                  <Link
                    to="/how-it-works"
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                      location.pathname.startsWith('/how-it-works')
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 text-indigo-500" />
                    <span>How It Works</span>
                  </Link>

                  <Link
                    to="/rental-shops"
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                      location.pathname.startsWith('/rental-shops')
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Store className="w-4 h-4 text-emerald-500" />
                    <span>Rental Shops</span>
                  </Link>

                  <Link
                    to="/contact-us"
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                      location.pathname.startsWith('/contact-us')
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Compass className="w-4 h-4 text-purple-500" />
                    <span>Support &amp; Contact</span>
                  </Link>
                </div>
              )}

            </div>

            {/* Drawer Bottom Actions: Sign Out */}
            <div 
              className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2"
              style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}
            >
              {user?._id ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="text-center text-[11px] text-slate-400 font-medium py-1">
                  DriveRent &bull; Car &amp; Bike Rentals
                </div>
              )}
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default Header
