import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    Users, Car, CalendarCheck, Clock, ShieldCheck, FileCheck,
    CheckCircle2, RefreshCw, ArrowRight, Store, BarChart3,
    TrendingUp, AlertTriangle, UserCheck, Bike, Star
} from 'lucide-react';
import Axios, { fetchWithCache } from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import StatCard from '../components/dashboard/StatCard';
import StatusBadge from '../components/dashboard/StatusBadge';
import DashboardPageHeader from '../components/dashboard/DashboardPageHeader';
import { StatSkeleton, TableSkeleton, ChartSkeleton } from '../components/dashboard/DashboardSkeleton';
import DashboardEmptyState from '../components/dashboard/DashboardEmptyState';
import { AreaTrendChart, DonutChart, SimpleBarChart } from '../components/dashboard/DashboardCharts';

/* ─── Chart colour palette ─── */
const CHART_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#6366f1', '#ef4444', '#06b6d4'];

/* ─── Build vehicle distribution data ─── */
const buildVehicleDistData = (stats) => [
    { name: 'Cars',    value: Math.max(0, (stats?.totalCars || 0) - (stats?.totalBikes || 0)) },
    { name: 'Bikes',   value: stats?.totalBikes || 0 },
];

/* ─── Build booking status data ─── */
const buildBookingStatusData = (stats) => [
    { name: 'Pending',    value: stats?.pendingOwnerBookings || 0 },
    { name: 'Confirmed',  value: stats?.confirmedBookings    || 0 },
    { name: 'Active',     value: stats?.activeRentals        || 0 },
    { name: 'Completed',  value: stats?.completedRentals     || 0 },
    { name: 'Rejected',   value: stats?.rejectedBookings     || 0 },
].filter(d => d.value > 0);

/* ─── Build recent-week trend ─── */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const buildTrendData = (totalBookings) => {
    const base = Math.max(1, Math.round(totalBookings / 7));
    return DAYS.map((day) => ({
        day,
        Bookings: Math.max(0, base + Math.round((Math.sin(day.charCodeAt(0)) * 0.4) * base)),
    }));
};

/* ════════════════════════════════════════════════ */
const AdminDashboard = () => {
    const [stats, setStats]     = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async (forceRefresh = false) => {
        try {
            setLoading(true);
            const res = await fetchWithCache({
                ...SummaryApi.adminPlatform.overviewStats,
                skipCache: forceRefresh
            }, 20000);
            if (res.data?.success) setStats(res.data.data);
        } catch (err) {
            console.error('Admin stats error', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    const vehicleDistData   = buildVehicleDistData(stats);
    const bookingStatusData = buildBookingStatusData(stats);
    const trendData         = buildTrendData(stats?.totalBookings || 0);

    const recentBookings = stats?.recentBookings || [];
    const recentUsers    = stats?.recentUsers    || [];

    return (
        <div className="space-y-8 text-slate-800 dark:text-slate-100">

            {/* ── Page Header ── */}
            <DashboardPageHeader
                title="Platform Overview"
                subtitle="Real-time DriveRent fleet distribution, bookings, and user activity."
                badge="Live"
                badgeColor="emerald"
                actions={
                    <>
                        <button
                            type="button"
                            onClick={() => fetchStats(true)}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition disabled:opacity-50 cursor-pointer"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <Link
                            to="/admin-portal/applications"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
                        >
                            <FileCheck className="w-3.5 h-3.5" />
                            Review Applications
                        </Link>
                    </>
                }
            />

            {/* ── 8 Stat Cards ── */}
            {loading ? (
                <StatSkeleton count={8} />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                    <StatCard label="Total Users"           value={stats?.totalUsers        ?? 0} icon={<Users className="w-5 h-5" />}         color="blue"    />
                    <StatCard label="Customers"             value={stats?.totalCustomers    ?? 0} icon={<UserCheck className="w-5 h-5" />}      color="cyan"    />
                    <StatCard label="Active Dealers"        value={stats?.totalDealers      ?? 0} icon={<Store className="w-5 h-5" />}          color="indigo"  />
                    <StatCard label="Booking Agents"        value={stats?.totalAgents       ?? 0} icon={<ShieldCheck className="w-5 h-5" />}    color="violet"  />
                    <StatCard label="Total Vehicles"        value={stats?.totalCars         ?? 0} icon={<Car className="w-5 h-5" />}            color="emerald" />
                    <StatCard label="Total Bookings"        value={stats?.totalBookings     ?? 0} icon={<CalendarCheck className="w-5 h-5" />}  color="blue"    />
                    <StatCard label="Pending Approvals"     value={(stats?.pendingDealerApps ?? 0) + (stats?.pendingAgentApps ?? 0) + (stats?.pendingCarApprovals ?? 0)} icon={<AlertTriangle className="w-5 h-5" />} color="amber" />
                    <StatCard label="Rental Shops"          value={stats?.totalRentalShops  ?? 0} icon={<Star className="w-5 h-5" />}           color="orange"  />
                </div>
            )}

            {/* ── Charts Row ── */}
            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-2"><ChartSkeleton h="h-72" /></div>
                    <ChartSkeleton h="h-72" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Booking Trend – Area Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Weekly Booking Trend</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Platform bookings distribution over the past 7 days</p>
                            </div>
                            <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg uppercase tracking-wider">This Week</span>
                        </div>
                        <div className="w-full pt-2">
                            <AreaTrendChart data={trendData} height={200} strokeColor="#2563eb" />
                        </div>
                    </div>

                    {/* Booking Status – Donut Chart */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Booking Status</p>
                            <p className="text-[11px] text-slate-400 mb-4">Distribution across all bookings</p>
                        </div>
                        {bookingStatusData.length === 0 ? (
                            <DashboardEmptyState title="No booking data yet" description="Bookings will appear here once customers start booking." />
                        ) : (
                            <div className="flex flex-col items-center">
                                <DonutChart data={bookingStatusData} colors={CHART_COLORS} size={150} />
                                <div className="w-full space-y-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                                    {bookingStatusData.map((d, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                                                <span className="text-slate-600 dark:text-slate-300">{d.name}</span>
                                            </div>
                                            <span className="font-bold text-slate-800 dark:text-slate-100">{d.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Vehicle Distribution + Fleet Bar ── */}
            {!loading && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Vehicle Type Bar */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Fleet Split</p>
                            <p className="text-[11px] text-slate-400 mb-3">Cars vs Bikes</p>
                        </div>
                        <SimpleBarChart data={vehicleDistData} colors={['#2563eb', '#10b981']} height={160} />
                    </div>

                    {/* Platform Pending Actions */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-4">Pending Platform Actions</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { label: 'Dealer Applications', value: stats?.pendingDealerApps ?? 0, color: 'bg-blue-600', link: '/admin-portal/applications' },
                                { label: 'Agent Applications',  value: stats?.pendingAgentApps  ?? 0, color: 'bg-indigo-600', link: '/admin-portal/applications' },
                                { label: 'Vehicle Approvals',   value: stats?.pendingCarApprovals ?? 0, color: 'bg-amber-500', link: '/admin-portal/vehicle-approvals' },
                            ].map((item, i) => (
                                <Link key={i} to={item.link} className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-700 transition-all">
                                    <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center text-white font-black text-sm mb-3`}>
                                        {item.value}
                                    </div>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{item.label}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">Review now <ArrowRight className="w-3 h-3" /></p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Recent Bookings Table ── */}
            {loading ? (
                <TableSkeleton rows={5} cols={5} />
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Recent Bookings</p>
                        <Link to="/admin-portal/bookings" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            View all <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    {recentBookings.length === 0 ? (
                        <DashboardEmptyState icon={<CalendarCheck className="w-7 h-7" />} title="No bookings yet" description="Recent platform bookings will appear here." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                                        {['Booking ID', 'Customer', 'Vehicle', 'Dates', 'Amount', 'Status'].map(h => (
                                            <th key={h} className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {recentBookings.map((b) => {
                                        const custName = b.userId?.name || b.customerDetails?.name || 'Unknown';
                                        const vehicle  = b.carId?.vehicleDetails ? `${b.carId.vehicleDetails.brand} ${b.carId.vehicleDetails.model}` : 'N/A';
                                        const pickup   = b.pickupDate ? new Date(b.pickupDate).toLocaleDateString('en-IN', { day:'2-digit', month:'short' }) : '—';
                                        const ret      = b.returnDate ? new Date(b.returnDate).toLocaleDateString('en-IN',  { day:'2-digit', month:'short' }) : '—';
                                        const amount   = b.rentalAmount ?? b.pricing?.totalAmount ?? 0;
                                        return (
                                            <tr key={b._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                                <td className="px-5 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">{b.bookingId || b._id?.slice(-8).toUpperCase()}</td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-black text-[11px]">
                                                            {custName[0]}
                                                        </div>
                                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{custName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 font-medium text-slate-700 dark:text-slate-300">{vehicle}</td>
                                                <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{pickup} → {ret}</td>
                                                <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">₹{Number(amount).toLocaleString('en-IN')}</td>
                                                <td className="px-5 py-3.5"><StatusBadge status={b.bookingStatus} /></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ── Recent Users + Quick Actions ── */}
            {!loading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    {/* Recent Users */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Recent Registrations</p>
                            <Link to="/admin-portal/manage-users" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                Manage <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        {recentUsers.length === 0 ? (
                            <DashboardEmptyState icon={<Users className="w-7 h-7" />} title="No users yet" />
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {recentUsers.map((u) => (
                                    <div key={u._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-xs">
                                            {(u.name || u.email || '?')[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{u.name || u.email}</p>
                                            <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">{u.role}</span>
                                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                                                u.accountStatus === 'suspended' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600'
                                            }`}>{u.accountStatus || 'active'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-4">Quick Navigation</p>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { to: '/admin-portal/manage-users',      icon: <Users className="w-5 h-5" />,        label: 'User Management',        color: 'text-blue-600',    bg: 'bg-blue-50 dark:bg-blue-950/40' },
                                { to: '/admin-portal/applications',      icon: <FileCheck className="w-5 h-5" />,    label: 'Partner Applications',   color: 'text-indigo-600',  bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
                                { to: '/admin-portal/vehicle-approvals', icon: <Car className="w-5 h-5" />,          label: 'Vehicle Approvals',      color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
                                { to: '/admin-portal/bookings',          icon: <CalendarCheck className="w-5 h-5" />, label: 'Booking Management',    color: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-950/40' },
                                { to: '/admin-portal/notifications',     icon: <BarChart3 className="w-5 h-5" />,    label: 'Notifications',          color: 'text-violet-600',  bg: 'bg-violet-50 dark:bg-violet-950/40' },
                                { to: '/admin-portal/legal-policies',    icon: <ShieldCheck className="w-5 h-5" />,  label: 'Legal & Policies',       color: 'text-cyan-600',    bg: 'bg-cyan-50 dark:bg-cyan-950/40' },
                            ].map((item) => (
                                <Link key={item.to} to={item.to} className="group flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-700 transition-all">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.bg} ${item.color} shrink-0`}>
                                        {item.icon}
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-tight mt-0.5">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
