import React from 'react'
import { Outlet, Navigate, NavLink, useLocation, useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { User, CalendarCheck, Heart, ShieldCheck, ChevronRight, LogOut, Car } from 'lucide-react'
import { getImageUrl } from '../utils/getImageUrl'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const Dashboard = () => {
  const user = useSelector(state => state.user)
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = localStorage.getItem('accessToken')

  if (!token && !user?._id) {
    return <Navigate to="/login" replace />
  }

  const tabs = [
    { to: '/dashboard/profile', label: 'My Profile', shortLabel: 'Profile', icon: User },
    { to: '/dashboard/my-bookings', label: 'My Bookings', shortLabel: 'Bookings', icon: CalendarCheck },
    { to: '/dashboard/wishlist', label: 'Wishlist Cars & Bikes', shortLabel: 'Wishlist', icon: Heart },
    { to: '/dashboard/privacy', label: 'Account Security', shortLabel: 'Security', icon: ShieldCheck }
  ]

  const handleLogout = async () => {
    try {
      const response = await Axios({ ...SummaryApi.logout })
      if (response?.data?.success) {
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

  return (
    <div className='min-h-[85vh] bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 py-3 sm:py-6 md:py-8 px-2 sm:px-4 md:px-6 lg:px-8 pb-24 md:pb-8 transition-colors duration-200'>
      <div className='max-w-7xl mx-auto'>
        
        {/* SIDE-BY-SIDE LAYOUT: Side Navigation on both Phone and Desktop */}
        <div className='flex gap-2.5 sm:gap-4 md:gap-6 items-start'>
          
          {/* LEFT SIDEBAR: Slim Icon Rail on Phone (< md), Full Card on Desktop (md+) */}
          <aside className='shrink-0 sticky top-20 md:top-24 z-30'>
            
            {/* MOBILE SIDE RAIL (< md: 54px wide slim dock on the left side) */}
            <div className='md:hidden bg-white dark:bg-[#161B26] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-2 shadow-xs flex flex-col items-center gap-2 w-[52px] sm:w-14'>
              
              {/* User Avatar Circle */}
              <div className='relative mb-1'>
                {user?.avatar ? (
                  <img
                    src={getImageUrl(user.avatar)}
                    alt={user.name}
                    className='w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700'
                  />
                ) : (
                  <div className='w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs'>
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className='w-2 h-2 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-white dark:ring-slate-900'></span>
              </div>

              {/* Vertical Navigation Icons */}
              <nav className='flex flex-col items-center gap-1.5 w-full'>
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = location.pathname === tab.to
                  return (
                    <NavLink
                      key={tab.to}
                      to={tab.to}
                      title={tab.label}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className='w-4 h-4' />
                    </NavLink>
                  )
                })}
              </nav>

              {/* Divider & Actions */}
              <div className='w-full pt-1.5 mt-1 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-1.5'>
                <Link
                  to='/cars'
                  title='Browse Fleet'
                  className='w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                >
                  <Car className='w-4 h-4' />
                </Link>
                <button
                  type='button'
                  onClick={handleLogout}
                  title='Sign Out'
                  className='w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer'
                >
                  <LogOut className='w-4 h-4' />
                </button>
              </div>

            </div>

            {/* DESKTOP/TABLET SIDEBAR (md+: 260px - 288px wide full card) */}
            <div className='hidden md:block w-64 lg:w-72 bg-white dark:bg-[#161B26] border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-5'>
              
              {/* Customer Dashboard Heading & Subtitle */}
              <div className='pb-4 border-b border-slate-100 dark:border-slate-800/80'>
                <h1 className='text-lg font-black text-slate-900 dark:text-white font-heading'>
                  Customer Dashboard
                </h1>
                <p className='text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed'>
                  Manage your personal profile, vehicle bookings, and account preferences
                </p>
              </div>

              {/* User Identity Pill / Card */}
              {user?.name && (
                <div className='p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3'>
                  {user?.avatar ? (
                    <img
                      src={getImageUrl(user.avatar)}
                      alt={user.name}
                      className='w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0'
                    />
                  ) : (
                    <div className='w-11 h-11 rounded-xl bg-blue-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs'>
                      {(user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-1.5'>
                      <span className='w-2 h-2 rounded-full bg-emerald-500 shrink-0' title="Active"></span>
                      <p className='text-xs font-bold text-slate-900 dark:text-white truncate'>
                        {user.name}
                      </p>
                    </div>
                    <p className='text-[11px] text-slate-400 truncate mt-0.5'>
                      {user.email || 'customer@driverent.com'}
                    </p>
                    <span className='inline-block mt-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400'>
                      {user.role || 'Customer'}
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation Menu */}
              <div>
                <p className='text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 mb-2'>
                  Navigation
                </p>
                <nav className='space-y-1'>
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = location.pathname === tab.to
                    return (
                      <NavLink
                        key={tab.to}
                        to={tab.to}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70'
                        }`}
                      >
                        <div className='flex items-center gap-3 min-w-0'>
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}>
                            <Icon className='w-3.5 h-3.5' />
                          </div>
                          <span className='truncate'>{tab.label}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive ? 'text-white translate-x-0.5' : 'text-slate-300 dark:text-slate-600'
                        }`} />
                      </NavLink>
                    )
                  })}
                </nav>
              </div>

              {/* Quick Actions & Logout */}
              <div className='pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1'>
                <Link
                  to='/cars'
                  className='flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'
                >
                  <Car className='w-4 h-4 text-slate-400' />
                  <span>Browse Available Fleet</span>
                </Link>
                <button
                  type='button'
                  onClick={handleLogout}
                  className='w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-left'
                >
                  <LogOut className='w-4 h-4' />
                  <span>Sign Out</span>
                </button>
              </div>

            </div>

          </aside>

          {/* RIGHT MAIN CONTENT AREA: Child route renders here */}
          <main className='flex-1 min-w-0'>
            <Outlet />
          </main>

        </div>

      </div>
    </div>
  )
}

export default Dashboard
