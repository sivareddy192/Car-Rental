import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Calendar,
  User,
  Heart,
  Settings,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  LogOut,
  MapPin,
  Car,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { updateUser, logoutUser } from '../../store/slices/authSlice';
import { SEOHead } from '../../components/common/SEOHead';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'bookings' | 'profile' | 'security'
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  // Cancellation modal
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');
  const [address, setAddress] = useState(user?.address || '');
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState(user?.drivingLicenseNumber || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoadingBookings(true);
      try {
        const res = await api.get('/bookings/my-bookings');
        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setIsLoadingBookings(false);
      }
    };
    fetchBookings();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const res = await api.put('/auth/profile', {
        name,
        phone,
        city,
        address,
        drivingLicenseNumber,
      });

      if (res.data.success) {
        toast.success('Profile details saved.');
        dispatch(updateUser(res.data.user));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res.data.success) {
        toast.success('Password updated successfully. Confirmation dispatched via Resend.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not change password.');
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleCancelBooking = async (e) => {
    e.preventDefault();
    if (!cancellingBooking) return;

    setIsSubmittingCancel(true);
    try {
      const res = await api.patch(`/bookings/${cancellingBooking._id}/cancel`, {
        reason: cancellationReason,
      });

      if (res.data.success) {
        toast.success('Reservation cancelled and cancellation voucher dispatched via Resend.');
        setBookings(
          bookings.map((b) => (b._id === cancellingBooking._id ? { ...b, status: 'cancelled' } : b))
        );
        setCancellingBooking(null);
        setCancellationReason('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel booking.');
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  const upcomingBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = bookings.filter((b) => b.status === 'completed');
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pt-28 pb-20 transition-colors">
      <SEOHead title="Member Dashboard — Car Rental" description="Manage your luxury bookings and profile credentials." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Member Card */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-6 sm:p-8 rounded-3xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-serif text-2xl font-bold text-zinc-950 dark:text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-zinc-950 dark:text-white">{user?.name}</h1>
                <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
                  Verified Member
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{user?.email}</p>
              {user?.phone && <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{user.phone}</p>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => dispatch(logoutUser())}
              className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Layout: Sidebar Tabs + Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tabs Navigation */}
          <aside className="space-y-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-3 rounded-2xl h-fit shadow-sm transition-colors">
            {[
              { id: 'overview', label: 'Overview', icon: Clock },
              { id: 'bookings', label: 'My Bookings', icon: Calendar, badge: bookings.length },
              { id: 'profile', label: 'Profile Information', icon: User },
              { id: 'security', label: 'Security & Password', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-bold shadow'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        activeTab === tab.id ? 'bg-zinc-800 text-white dark:bg-black dark:text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </aside>

          {/* Main Tab Panel */}
          <main className="lg:col-span-3">
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-6 rounded-2xl shadow-sm transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                      Total Reservations
                    </span>
                    <div className="text-3xl font-serif font-black text-zinc-950 dark:text-white mt-1">
                      {bookings.length}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-6 rounded-2xl shadow-sm transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                      Upcoming / Active
                    </span>
                    <div className="text-3xl font-serif font-black text-emerald-600 dark:text-emerald-400 mt-1">
                      {upcomingBookings.length}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-6 rounded-2xl shadow-sm transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                      Cancelled
                    </span>
                    <div className="text-3xl font-serif font-black text-zinc-400 dark:text-zinc-400 mt-1">
                      {cancelledBookings.length}
                    </div>
                  </div>
                </div>

                {/* Recent Booking Card */}
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-6 rounded-2xl shadow-sm transition-colors">
                  <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-white mb-4 uppercase tracking-wide">
                    Recent Reservation
                  </h3>

                  {bookings.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500 dark:text-zinc-400 text-xs">
                      No reservations yet.{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('bookings')}
                        className="text-zinc-950 dark:text-white underline font-semibold"
                      >
                        Explore Showroom
                      </button>
                    </div>
                  ) : (
                    <div className="border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 block">
                          REF: {bookings[0].bookingReference}
                        </span>
                        <h4 className="font-bold text-zinc-950 dark:text-white text-base mt-0.5">
                          {bookings[0].vehicleId?.brand} {bookings[0].vehicleId?.name}
                        </h4>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-3">
                          <span>
                            {new Date(bookings[0].startDate).toLocaleDateString()} &rarr;{' '}
                            {new Date(bookings[0].endDate).toLocaleDateString()}
                          </span>
                          <span className="capitalize font-semibold text-emerald-600 dark:text-emerald-400">
                            {bookings[0].status}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-zinc-950 dark:text-white block">
                          ₹{Number(bookings[0].totalAmount).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase">Paid / Confirmed</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. MY BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-6 rounded-2xl space-y-6 shadow-sm transition-colors">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-850">
                  <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wide">
                    All Reservations
                  </h3>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">{bookings.length} Total</span>
                </div>

                {isLoadingBookings ? (
                  <LoadingSpinner text="Retrieving reservations..." />
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12 text-xs text-zinc-500 dark:text-zinc-400">
                    No bookings found. Head to the showroom to make your first reservation.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-zinc-950 dark:text-white">
                              {booking.bookingReference}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                booking.status === 'confirmed'
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                  : booking.status === 'cancelled'
                                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>

                          <h4 className="font-bold text-zinc-950 dark:text-white text-sm">
                            {booking.vehicleId?.brand} {booking.vehicleId?.name}
                          </h4>

                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {new Date(booking.startDate).toLocaleDateString()} to{' '}
                            {new Date(booking.endDate).toLocaleDateString()} ({booking.totalDays} Days)
                          </p>

                          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                            Pickup: {booking.pickupLocation} | Return: {booking.dropoffLocation}
                          </p>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                          <span className="font-mono text-base font-bold text-zinc-950 dark:text-white">
                            ₹{Number(booking.totalAmount).toLocaleString('en-IN')}
                          </span>

                          {booking.status !== 'cancelled' && (
                            <button
                              type="button"
                              onClick={() => setCancellingBooking(booking)}
                              className="px-3 py-1 rounded bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800 text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-300 transition-colors"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. PROFILE SETTINGS TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-6 sm:p-8 rounded-2xl shadow-sm transition-colors">
                <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wide mb-6">
                  Profile Information
                </h3>

                <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-700 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                        Full Legal Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-700 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-700 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                        City of Residence
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-700 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                        Driving License Number
                      </label>
                      <input
                        type="text"
                        value={drivingLicenseNumber}
                        onChange={(e) => setDrivingLicenseNumber(e.target.value)}
                        placeholder="TS-09-2023-XXXXXXX"
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                      Delivery Address
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="px-6 py-3 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg"
                  >
                    {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* 4. SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-6 sm:p-8 rounded-2xl shadow-sm transition-colors">
                <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wide mb-6">
                  Account Security & Password
                </h3>

                <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-md">
                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isChangingPass}
                    className="px-6 py-3 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg"
                  >
                    {isChangingPass ? 'Updating...' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* CANCELLATION MODAL */}
      <Modal
        isOpen={!!cancellingBooking}
        onClose={() => setCancellingBooking(null)}
        title="Cancel Reservation"
      >
        <form onSubmit={handleCancelBooking} className="space-y-4 text-xs">
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Are you sure you want to cancel booking{' '}
            <strong className="text-zinc-950 dark:text-white">{cancellingBooking?.bookingReference}</strong> for the{' '}
            <strong className="text-zinc-950 dark:text-white">
              {cancellingBooking?.vehicleId?.brand} {cancellingBooking?.vehicleId?.name}
            </strong>
            ?
          </p>

          <div>
            <label className="block text-zinc-700 dark:text-zinc-400 mb-1 font-bold uppercase">Reason for Cancellation</label>
            <textarea
              rows={3}
              required
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="E.g. Travel schedule change, flight cancellation..."
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCancellingBooking(null)}
              className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-semibold transition-colors"
            >
              Keep Booking
            </button>
            <button
              type="submit"
              disabled={isSubmittingCancel}
              className="px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-500 transition-colors"
            >
              {isSubmittingCancel ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
