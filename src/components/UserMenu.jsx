import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { User as LuUser, CalendarCheck as LuCalendarCheck, Heart as LuHeart, LogOut as LuLogOut, LayoutDashboard as LuLayoutDashboard, Car as LuCar, ShieldCheck as LuShieldCheck } from 'lucide-react'
import { getImageUrl } from '../utils/getImageUrl'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const UserMenu = ({ close }) => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await Axios({ ...SummaryApi.logout })
      if (response?.data?.success) {
        close?.()
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
    <div className='w-full max-w-[320px] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150'>
      
      {/* User Header */}
      <div className='p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60'>
        <div className='flex items-center gap-3'>
          {user?.avatar ? (
            <img
              src={getImageUrl(user.avatar)}
              alt=''
              className='h-11 w-11 shrink-0 rounded-xl border border-slate-200 dark:border-slate-700 object-cover'
            />
          ) : (
            <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-lg'>
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div className='min-w-0 flex-1'>
            <p className='truncate text-sm font-bold text-slate-900 dark:text-white'>{user?.name || 'Valued User'}</p>
            <p className='truncate text-xs text-slate-400'>{user?.email}</p>
            <span className='inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400'>
              {user?.role || 'Customer'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links: Role-based navigation */}
      <nav className='p-2 space-y-1' aria-label='Account menu'>
        {user?.role === 'dealer' ? (
          <>
            <Link
              onClick={close}
              to='/dealer/dashboard'
              className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
            >
              <LuLayoutDashboard className='w-4 h-4 text-blue-600' />
              <span>Dealer Dashboard</span>
            </Link>
            <Link
              onClick={close}
              to='/dealer/fleet'
              className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
            >
              <LuCar className='w-4 h-4 text-emerald-500' />
              <span>My Fleet</span>
            </Link>
            <Link
              onClick={close}
              to='/dealer/bookings'
              className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
            >
              <LuCalendarCheck className='w-4 h-4 text-amber-500' />
              <span>Booking Requests</span>
            </Link>
            <Link
              onClick={close}
              to='/dealer/profile'
              className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
            >
              <LuUser className='w-4 h-4 text-purple-500' />
              <span>My Profile</span>
            </Link>
          </>
        ) : user?.role === 'admin' ? (
          <>
            <Link
              onClick={close}
              to='/admin-portal/dashboard'
              className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
            >
              <LuLayoutDashboard className='w-4 h-4 text-purple-600' />
              <span>Admin Console</span>
            </Link>
            <Link
              onClick={close}
              to='/admin-portal/manage-users'
              className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
            >
              <LuUser className='w-4 h-4 text-blue-500' />
              <span>Manage Users</span>
            </Link>
            <Link
              onClick={close}
              to='/admin-portal/vehicle-approvals'
              className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
            >
              <LuShieldCheck className='w-4 h-4 text-emerald-500' />
              <span>Vehicle Approvals</span>
            </Link>
            <Link
              onClick={close}
              to='/admin-portal/profile'
              className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
            >
              <LuUser className='w-4 h-4 text-slate-500' />
              <span>My Profile</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              onClick={close}
              to='/dashboard/profile'
              className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
            >
              <LuUser className='w-4 h-4 text-blue-600' />
              <span>My Profile</span>
            </Link>

            <Link
              onClick={close}
              to='/dashboard/my-bookings'
              className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
            >
              <LuCalendarCheck className='w-4 h-4 text-amber-500' />
              <span>My Bookings</span>
            </Link>

            <Link
              onClick={close}
              to='/dashboard/wishlist'
              className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
            >
              <LuHeart className='w-4 h-4 text-rose-500 fill-rose-500/20' />
              <span>Wishlist Cars &amp; Bikes</span>
            </Link>
          </>
        )}
      </nav>

      {/* Logout */}
      <div className='border-t border-slate-100 dark:border-slate-800 p-2'>
        <button
          type='button'
          onClick={handleLogout}
          className='flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer'
        >
          <LuLogOut className='w-4 h-4' />
          <span>Sign Out</span>
        </button>
      </div>

    </div>
  )
}

export default UserMenu
