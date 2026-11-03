import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Car, CalendarCheck, Clock, Plus, TrendingUp,
    CheckCircle2, RefreshCw, ArrowRight, DollarSign,
    Users, Check, X, Eye, Bike, AlertTriangle, Star,
    ShieldCheck, Sparkles, FileCheck, Layers
} from 'lucide-react';
import toast from 'react-hot-toast';
import Axios, { fetchWithCache } from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import StatCard from '../components/dashboard/StatCard';
import StatusBadge from '../components/dashboard/StatusBadge';
import DashboardPageHeader from '../components/dashboard/DashboardPageHeader';
import { StatSkeleton, TableSkeleton, ChartSkeleton } from '../components/dashboard/DashboardSkeleton';
import DashboardEmptyState from '../components/dashboard/DashboardEmptyState';
import { AreaTrendChart, DonutChart, SimpleBarChart } from '../components/dashboard/DashboardCharts';

/* ─── Chart colour palettes ─── */
const CHART_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#6366f1', '#ef4444', '#06b6d4'];
const PIE_COLORS   = ['#f59e0b', '#10b981', '#2563eb', '#6366f1', '#ef4444'];
const DAYS         = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* ─── Build weekly booking trend ─── */
const buildTrendData = (bookings) => {
    const dayCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    if (bookings && bookings.length > 0) {
        bookings.forEach(b => {
            const date = new Date(b.createdAt || b.pickupDate || Date.now());
            const dayIndex = date.getDay(); // 0 is Sun
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const name = dayNames[dayIndex];
            if (dayCounts[name] !== undefined) dayCounts[name]++;
        });
    }
    return DAYS.map(day => ({
        day,
        Bookings: dayCounts[day] || 0,
    }));
};

/* ─── Build booking status distribution ─── */
const buildStatusData = (bookings) => {
    const counts = { Pending: 0, Confirmed: 0, Active: 0, Completed: 0, Rejected: 0 };
    bookings.forEach(b => {
        const s = b.bookingStatus;
        if (s === 'pending_owner_approval' || s === 'pending') counts.Pending++;
        else if (s === 'confirmed') counts.Confirmed++;
        else if (s === 'active_rental' || s === 'active' || s === 'in_progress') counts.Active++;
        else if (s === 'completed') counts.Completed++;
        else if (s === 'rejected') counts.Rejected++;
    });
    return Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .filter(d => d.value > 0);
};

/* ─── Build fleet category distribution ─── */
const buildCategoryData = (fleet) => {
    const counts = {};
    fleet.forEach(v => {
        const cat = v.vehicleDetails?.category || (v.vehicleType === 'bike' ? 'Bikes' : 'Standard Car');
        counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
};

/* ════════════════════════════════════════════════ */
const DealerDashboard = () => {
    const user = useSelector(state => state.user);
    const [fleet, setFleet]               = useState([]);
    const [bookings, setBookings]         = useState([]);
    const [loading, setLoading]           = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const fetchData = useCallback(async (forceRefresh = false) => {
        try {
            setLoading(true);
            const [fleetRes, bookingsRes] = await Promise.allSettled([
                fetchWithCache({ ...SummaryApi.cars.myFleet, skipCache: forceRefresh }, 15000),
                fetchWithCache({ ...SummaryApi.booking.dealerBookings, skipCache: forceRefresh }, 15000),
            ]);
            if (fleetRes.status === 'fulfilled' && fleetRes.value.data?.success) {
                setFleet(fleetRes.value.data.data || []);
            }
            if (bookingsRes.status === 'fulfilled' && bookingsRes.value.data?.success) {
                setBookings(bookingsRes.value.data.data || []);
            }
        } catch (err) {
            console.error('DealerDashboard fetch error', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /* ─── Booking Quick Action (Accept / Reject) ─── */
    const handleQuickAction = async (bookingId, action) => {
        try {
            setProcessingId(bookingId);
            const res = await Axios({
                ...SummaryApi.booking.dealerDecision(bookingId),
                data: {
                    action,
                    remarks: action === 'approved' ? 'Confirmed by authorized dealer' : 'Vehicle unavailable for requested dates',
                },
            });
            if (res.data?.success) {
                toast.success(`Booking ${action === 'approved' ? 'confirmed' : 'rejected'} successfully!`);
                fetchData(true);
            } else {
                toast.error(res.data?.message || 'Failed to update booking status.');
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setProcessingId(null);
        }
    };

    /* ─── Derived statistics ─── */
    const totalVehicles    = fleet.length;
    const approvedVehicles = fleet.filter(v => v.approvalStatus === 'approved').length;
    const pendingVehicles  = fleet.filter(v => v.approvalStatus === 'pending_approval').length;
    const carsCount        = fleet.filter(v => (v.vehicleType || 'car') === 'car').length;
    const bikesCount       = fleet.filter(v => v.vehicleType === 'bike').length;

    const pendingBookings  = bookings.filter(b => b.bookingStatus === 'pending_owner_approval' || b.bookingStatus === 'pending');
    const activeRentals    = bookings.filter(b => ['active_rental', 'active', 'in_progress'].includes(b.bookingStatus)).length;
    const totalEarnings    = bookings
        .filter(b => ['confirmed', 'completed', 'active_rental', 'active'].includes(b.bookingStatus))
        .reduce((sum, b) => sum + (Number(b.rentalAmount ?? b.pricing?.totalAmount) || 0), 0);

    const trendData        = buildTrendData(bookings);
    const statusData       = buildStatusData(bookings);
    const categoryData     = buildCategoryData(fleet);
    const greetName        = user?.name?.split(' ')[0] || 'Dealer';

    return (
        <div className="space-y-8 text-slate-800 dark:text-slate-100">

            {/* ── Page Header ── */}
            <DashboardPageHeader
                title={`Welcome back, ${greetName} 👋`}
                subtitle="Real-time DriveRent fleet distribution, booking requests, and revenue analytics."
                badge="Dealer Hub"
                badgeColor="indigo"
                actions={
                    <>
                        <button
                            type="button"
                            onClick={() => fetchData(true)}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition disabled:opacity-50 cursor-pointer"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <Link
                            to="/dealer/cars/add"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Vehicle
                        </Link>
                    </>
                }
            />

            {/* ── Pending Requests Alert Banner ── */}
            {pendingBookings.length > 0 && (
                <div className="flex items-center justify-between gap-3 px-5 py-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl">
                    <div className="flex items-center gap-3 min-w-0">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                        <p className="text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-300 truncate">
                            You have <strong>{pendingBookings.length}</strong> booking request{pendingBookings.length > 1 ? 's' : ''} waiting for your confirmation.
                        </p>
                    </div>
                    <Link
                        to="/dealer/bookings"
                        className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200 flex items-center gap-1 shrink-0"
                    >
                        Review now <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            )}

            {/* ── 8 Stat Cards (Enterprise Grid) ── */}
            {loading ? (
                <StatSkeleton count={8} />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                    <StatCard label="Total Fleet"        value={totalVehicles}                                  icon={<Car className="w-5 h-5" />}           color="blue"    />
                    <StatCard label="Active Vehicles"    value={approvedVehicles}                               icon={<CheckCircle2 className="w-5 h-5" />}   color="emerald" />
                    <StatCard label="Pending Approvals"  value={pendingVehicles}                                icon={<Clock className="w-5 h-5" />}         color="amber"   />
                    <StatCard label="Booking Requests"   value={pendingBookings.length}                         icon={<CalendarCheck className="w-5 h-5" />}  color="rose"    />
                    <StatCard label="Active Rentals"     value={activeRentals}                                  icon={<TrendingUp className="w-5 h-5" />}     color="indigo"  />
                    <StatCard label="Total Earnings"     value={`₹${totalEarnings.toLocaleString('en-IN')}`}   icon={<DollarSign className="w-5 h-5" />}     color="violet"  />
                    <StatCard label="Cars in Fleet"      value={carsCount}                                      icon={<Car className="w-5 h-5" />}           color="cyan"    />
                    <StatCard label="Bikes in Fleet"     value={bikesCount}                                     icon={<Bike className="w-5 h-5" />}          color="orange"  />
                </div>
            )}

            {/* ── Charts Row 1: Trend + Donut ── */}
            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-2"><ChartSkeleton h="h-72" /></div>
                    <ChartSkeleton h="h-72" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Booking Demand Trend – Area Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Weekly Booking Demand</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Customer reservations activity over the past 7 days</p>
                            </div>
                            <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                This Week
                            </span>
                        </div>
                        <div className="w-full pt-2">
                            <AreaTrendChart data={trendData} height={200} strokeColor="#2563eb" />
                        </div>
                    </div>

                    {/* Booking Status Breakdown – Donut Chart */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Booking Status</p>
                            <p className="text-[11px] text-slate-400 mb-4">Distribution across all your bookings</p>
                        </div>
                        {statusData.length === 0 ? (
                            <DashboardEmptyState
                                icon={<CalendarCheck className="w-7 h-7" />}
                                title="No booking data yet"
                                description="Booking requests from customers will appear here."
                            />
                        ) : (
                            <div className="flex flex-col items-center">
                                <DonutChart data={statusData} colors={PIE_COLORS} size={150} />
                                <div className="w-full space-y-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                                    {statusData.map((d, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <span
                                                    className="w-2.5 h-2.5 rounded-full"
                                                    style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                                                />
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

            {/* ── Charts Row 2: Fleet Category Bar + Pending Actions ── */}
            {!loading && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Fleet Categories Bar Chart */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Fleet by Category</p>
                            <p className="text-[11px] text-slate-400 mb-3">Vehicles grouped by specification</p>
                        </div>
                        {categoryData.length === 0 ? (
                            <DashboardEmptyState
                                icon={<Car className="w-7 h-7" />}
                                title="No vehicles in fleet"
                                description="Add vehicles to see category breakdown."
                            />
                        ) : (
                            <SimpleBarChart data={categoryData} colors={CHART_COLORS} height={160} />
                        )}
                    </div>

                    {/* Pending Actions & Shortcuts */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-4">Pending Store Actions</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { label: 'Customer Requests',   value: pendingBookings.length, color: 'bg-rose-500',   link: '/dealer/bookings' },
                                { label: 'Awaiting Approvals',  value: pendingVehicles,        color: 'bg-amber-500',  link: '/dealer/fleet' },
                                { label: 'Active On-Road Trips', value: activeRentals,          color: 'bg-indigo-600', link: '/dealer/bookings' },
                            ].map((item, i) => (
                                <Link
                                    key={i}
                                    to={item.link}
                                    className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-700 transition-all"
                                >
                                    <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center text-white font-black text-sm mb-3`}>
                                        {item.value}
                                    </div>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                                        {item.label}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                        Manage now <ArrowRight className="w-3 h-3" />
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Recent Booking Requests Table ── */}
            {loading ? (
                <TableSkeleton rows={5} cols={6} />
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Recent Booking Requests</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Manage customer reservations, accept new bookings, or update schedules</p>
                        </div>
                        <Link to="/dealer/bookings" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            View all <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {bookings.length === 0 ? (
                        <DashboardEmptyState
                            icon={<CalendarCheck className="w-7 h-7" />}
                            title="No booking requests yet"
                            description="Customer reservations will appear here with instant decision controls."
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                                        {['Booking ID', 'Customer', 'Vehicle', 'Dates', 'Amount', 'Status', 'Quick Action'].map(h => (
                                            <th key={h} className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {bookings.slice(0, 8).map((b) => {
                                        const custName  = b.customerName || b.customerDetails?.name || b.userId?.name || 'Customer';
                                        const vehicle   = b.carId?.vehicleDetails ? `${b.carId.vehicleDetails.brand} ${b.carId.vehicleDetails.model}` : 'N/A';
                                        const pickup    = b.pickupDate ? new Date(b.pickupDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—';
                                        const ret       = b.returnDate ? new Date(b.returnDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—';
                                        const amount    = b.rentalAmount ?? b.pricing?.totalAmount ?? 0;
                                        const isPending = b.bookingStatus === 'pending_owner_approval' || b.bookingStatus === 'pending';

                                        return (
                                            <tr key={b._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                                <td className="px-5 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                                                    {b.bookingId || b._id?.slice(-8).toUpperCase()}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center font-black text-[11px] shrink-0">
                                                            {custName[0]?.toUpperCase() || 'C'}
                                                        </div>
                                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                            {custName}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 font-medium text-slate-700 dark:text-slate-300">
                                                    {vehicle}
                                                </td>
                                                <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                    {pickup} → {ret}
                                                </td>
                                                <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                                                    ₹{Number(amount).toLocaleString('en-IN')}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <StatusBadge status={b.bookingStatus} />
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    {isPending ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <button
                                                                type="button"
                                                                disabled={processingId === b._id}
                                                                onClick={() => handleQuickAction(b._id, 'approved')}
                                                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition disabled:opacity-50 cursor-pointer"
                                                            >
                                                                <Check className="w-3 h-3" /> Accept
                                                            </button>
                                                            <button
                                                                type="button"
                                                                disabled={processingId === b._id}
                                                                onClick={() => handleQuickAction(b._id, 'rejected')}
                                                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 font-bold text-[10px] transition disabled:opacity-50 cursor-pointer"
                                                            >
                                                                <X className="w-3 h-3" /> Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <Link
                                                            to="/dealer/bookings"
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-semibold hover:text-blue-600 transition"
                                                        >
                                                            <Eye className="w-3 h-3" /> View Details
                                                        </Link>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ── Quick Navigation Shortcuts ── */}
            {!loading && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-4">Quick Navigation</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { to: '/dealer/fleet',      icon: <Car className="w-5 h-5" />,          label: 'My Fleet Inventory', sub: `${totalVehicles} registered`, color: 'text-blue-600',    bg: 'bg-blue-50 dark:bg-blue-950/40' },
                            { to: '/dealer/cars/add',   icon: <Plus className="w-5 h-5" />,         label: 'Add New Vehicle',    sub: 'Expand your fleet',  color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
                            { to: '/dealer/bookings',   icon: <CalendarCheck className="w-5 h-5" />,label: 'All Bookings',       sub: `${bookings.length} requests`, color: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-950/40' },
                            { to: '/dealer/status',     icon: <Star className="w-5 h-5" />,         label: 'Shop Status',        sub: 'Verification info',   color: 'text-violet-600',  bg: 'bg-violet-50 dark:bg-violet-950/40' },
                        ].map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="group flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-700 transition-all"
                            >
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.bg} ${item.color} shrink-0`}>
                                    {item.icon}
                                </div>
                                <div className="min-w-0">
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-tight block truncate">
                                        {item.label}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block mt-0.5">{item.sub}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default DealerDashboard;
