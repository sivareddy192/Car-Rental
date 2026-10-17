import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Shield, BarChart3, Car, Calendar, Users, MessageSquare,
  FileText, Newspaper, Plus, Activity, Menu, X, Bell, Search,
  ChevronRight, LogOut, Settings, Sun, Moon, User,
  KeyRound, ExternalLink
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { ScrollToTop } from '../../components/common/ScrollToTop';
import { CloudinaryImageUpload } from '../../components/admin/CloudinaryImageUpload';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, clearCredentials, updateUser } from '../../store/slices/authSlice';
import { useTheme, ThemeToggle } from '../../context/ThemeContext';
import { Modal } from '../../components/common/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard Overview', icon: BarChart3, end: true },
  { to: '/admin/bookings', label: 'Reservations & Bookings', icon: Calendar },
  { to: '/admin/fleet', label: 'Fleet Management', icon: Car },
  { to: '/admin/leads', label: 'Sales & Concierge Leads', icon: MessageSquare },
  { to: '/admin/messages', label: 'Contact Messages', icon: FileText },
  { to: '/admin/blogs', label: 'Blog Management', icon: Newspaper },
  { to: '/admin/customers', label: 'Customers & Members', icon: Users },
  { to: '/admin/audit', label: 'Security & Audit Logs', icon: Activity },
];

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser()).finally(() => dispatch(clearCredentials()));
    navigate('/login');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put('/auth/profile', {
        name: profileForm.name,
        phone: profileForm.phone,
        avatar: profileForm.avatar,
      });
      if (res.data.success) {
        dispatch(updateUser(res.data.user));
        toast.success('Admin profile updated successfully.');
        setProfileModalOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setSavingPassword(true);
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      if (res.data.success) {
        toast.success('Password changed successfully.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setProfileModalOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0d14] text-slate-900 dark:text-slate-100 flex font-sans antialiased selection:bg-amber-500/20">
      <ScrollToTop />
      <SEOHead title="Admin Console — Car Rental" description="Fleet operations and reservation telemetry." />

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 dark:bg-black/80 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* STICKY SIDEBAR — Locked at viewport, never scrolls away */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white dark:bg-[#0f121d] border-r border-slate-200/90 dark:border-white/[0.07] flex flex-col transition-transform duration-300 ease-out shadow-xs
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="px-12 py-7 border-b border-slate-100 dark:border-white/[0.07] bg-white dark:bg-[#0f121d] shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <div className="font-black text-base text-slate-900 dark:text-white tracking-tight font-serif">
                Car Rental
              </div>
            </div>
          </div>
        </div>

        {/* Navigation — Smooth independent internal scroll */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1 bg-white dark:bg-[#0f121d]">
          <p className="px-3 mb-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.18em]">
            Management Portal
          </p>

          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 relative
                ${isActive
                  ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-500/20 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.04] font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-amber-500" />
                  )}
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                    }`}
                  />
                  <span className="flex-1 text-xs">{label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions & User Profile */}
        <div className="p-3 border-t border-slate-100 dark:border-white/[0.07] bg-slate-50/70 dark:bg-[#0b0d14]/70 space-y-2 shrink-0">
          <NavLink
            to="/admin/fleet"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-md bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Fleet Vehicle</span>
          </NavLink>

          {/* User card with Settings cog */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-[#141724] border border-slate-200/90 dark:border-white/[0.07] shadow-xs">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-black text-xs text-slate-950 shrink-0 shadow-xs">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">
                {user?.name || 'Administrator'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {user?.email || 'admin@royaldrives.com'}
              </div>
            </div>

            {/* Profile Settings Modal Trigger */}
            <button
              type="button"
              onClick={() => {
                setProfileForm({
                  name: user?.name || '',
                  phone: user?.phone || '',
                  avatar: user?.avatar || '',
                });
                setProfileModalOpen(true);
              }}
              title="Profile Settings"
              className="p-1.5 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT CANVAS */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0b0d14]">
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-[#0f121d]/90 backdrop-blur-md border-b border-slate-200/90 dark:border-white/[0.07] flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-xs">
          {/* Left section: mobile hamburger & search */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              type="button"
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="relative flex-1 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search telemetry, vehicles, bookings..."
                className="w-full bg-slate-50 dark:bg-[#141724] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:outline-none focus:bg-white dark:focus:bg-[#181c2c] focus:border-amber-500"
              />
            </div>
          </div>

          {/* Right section: Theme White/Dark toggle & Profile Settings */}
          <div className="flex items-center gap-2.5">
            {/* THEME TOGGLE: Animated Squircle Switch matching user reference */}
            <ThemeToggle />

            {/* Profile Settings Trigger Button */}
            <button
              type="button"
              onClick={() => {
                setProfileForm({
                  name: user?.name || '',
                  phone: user?.phone || '',
                  avatar: user?.avatar || '',
                });
                setProfileModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#141724] hover:bg-slate-50 dark:hover:bg-[#181c2c] text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-xs"
              title="Profile Settings"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Profile Settings</span>
            </button>

            {/* Visit Live Website */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#141724] transition-all shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Live Site</span>
            </a>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                className="p-2 rounded-xl border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#141724] transition-all shadow-xs"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-[#0f121d]" />
              </button>
            </div>
          </div>
        </header>

        {/* OUTLET PAGE CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-[#0b0d14]">
          <Outlet />
        </main>
      </div>

      {/* PROFILE SETTINGS MODAL */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="Admin Profile Settings"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-white/[0.08]">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'profile'
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile Details</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('password')}
              className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'password'
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>
          </div>

          {/* Profile Details Form */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-3.5 pt-1">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="Administrator Name"
                  className="w-full bg-slate-50 dark:bg-[#0f121d] border border-slate-200 dark:border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-slate-100 dark:bg-[#0f121d]/60 border border-slate-200 dark:border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-slate-500 dark:text-slate-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">
                  Email is locked to primary administrator account.
                </span>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase tracking-wider mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 dark:bg-[#0f121d] border border-slate-200 dark:border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <CloudinaryImageUpload
                label="Avatar image"
                value={profileForm.avatar}
                onChange={(avatar) => setProfileForm({ ...profileForm, avatar })}
              />

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Change Password Form */}
          {activeTab === 'password' && (
            <form onSubmit={handleSavePassword} className="space-y-3.5 pt-1">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase tracking-wider mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-[#0f121d] border border-slate-200 dark:border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full bg-slate-50 dark:bg-[#0f121d] border border-slate-200 dark:border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-[#0f121d] border border-slate-200 dark:border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {savingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AdminLayout;
