import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
    CalendarCheck, Car, User, MapPin, Phone,
    RefreshCw, ShieldCheck, CheckCircle2, Clock,
    ArrowRight, Eye, TrendingUp, AlertCircle, Package
} from 'lucide-react';
import Axios, { fetchWithCache } from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import StatCard from '../components/dashboard/StatCard';
import StatusBadge from '../components/dashboard/StatusBadge';
import DashboardPageHeader from '../components/dashboard/DashboardPageHeader';
import { StatSkeleton, TableSkeleton } from '../components/dashboard/DashboardSkeleton';
import DashboardEmptyState from '../components/dashboard/DashboardEmptyState';
import { SimpleBarChart } from '../components/dashboard/DashboardCharts';

/* ─── Colours ─── */
const BAR_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#6b7280', '#ef4444'];

/* ─── Build per-status bar chart data ─── */
const buildStatusBar = (bookings) => {
    const map = {
        'Pending':   ['pending_owner_approval', 'pending'],
        'Confirmed': ['confirmed'],
        'Active':    ['active_rental', 'active', 'in_progress'],
        'Completed': ['completed'],
        'Rejected':  ['rejected'],
    };
    return Object.entries(map).map(([name, statuses]) => ({
        name,
        value: bookings.filter(b => statuses.includes(b.bookingStatus)).length,
    }));
};

/* ════════════════════════════════════════════════ */
const AgentDashboard = () => {
    const user = useSelector(state => state.user);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading]   = useState(true);

    const fetchBookings = useCallback(async (forceRefresh = false) => {
        try {
            setLoading(true);
            const res = await fetchWithCache({
                ...SummaryApi.booking.agentBookings,
                skipCache: forceRefresh
            }, 15000);
            if (res.data?.success) setBookings(res.data.data || []);
        } catch (err) { AxiosToastError(err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    /* ─── Derived stats ─── */
    const totalAssigned  = bookings.length;
    const pendingCount   = bookings.filter(b => ['pending_owner_approval', 'pending'].includes(b.bookingStatus)).length;
    const confirmedCount = bookings.filter(b => b.bookingStatus === 'confirmed').length;
    const activeCount    = bookings.filter(b => ['active_rental', 'active', 'in_progress'].includes(b.bookingStatus)).length;
    const completedCount = bookings.filter(b => b.bookingStatus === 'completed').length;
    const totalAmount    = bookings.reduce((sum, b) => sum + (Number(b.rentalAmount) || 0), 0);

    const statusBarData  = buildStatusBar(bookings);
    const greetName      = user?.name?.split(' ')[0] || 'Agent';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

                {/* ── Header ── */}
                <DashboardPageHeader
                    title={`Agent Hub – ${greetName}`}
                    subtitle="Coordinate vehicle handovers, verify pickup documentation, and assist rental customers."
                    badge="Agent"
                    badgeColor="indigo"
                    actions={
                        <button type="button" onClick={() => fetchBookings(true)} disabled={loading}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition disabled:opacity-50 cursor-pointer">
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    }
                />

                {/* ── Active Rentals Alert ── */}
                {activeCount > 0 && (
                    <div className="flex items-center gap-3 px-5 py-3.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-2xl">
                        <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                            <strong>{activeCount}</strong> vehicle{activeCount > 1 ? 's are' : ' is'} currently on active rental – monitor vehicle handover status.
                        </p>
                    </div>
                )}

                {/* ── Stat Cards ── */}
                {loading ? <StatSkeleton count={5} /> : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        <StatCard label="Assigned"        value={totalAssigned}  icon={<Package className="w-5 h-5" />}       color="indigo"  />
                        <StatCard label="Pending"         value={pendingCount}   icon={<Clock className="w-5 h-5" />}          color="amber"   />
                        <StatCard label="Ready for Pickup" value={confirmedCount} icon={<CalendarCheck className="w-5 h-5" />} color="blue"    />
                        <StatCard label="On Road"         value={activeCount}    icon={<TrendingUp className="w-5 h-5" />}     color="emerald" />
                        <StatCard label="Completed"       value={completedCount} icon={<CheckCircle2 className="w-5 h-5" />}  color="cyan"    />
                    </div>
                )}

                {/* ── Chart + Summary ── */}
                {!loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                        {/* Status Bar Chart */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Booking Status Breakdown</p>
                                <p className="text-[11px] text-slate-400 mb-4">All assigned bookings by status</p>
                            </div>
                            {totalAssigned === 0 ? (
                                <DashboardEmptyState icon={<CalendarCheck className="w-7 h-7" />} title="No bookings assigned" description="Assigned bookings will appear here." />
                            ) : (
                                <SimpleBarChart data={statusBarData} colors={BAR_COLORS} height={190} />
                            )}
                        </div>

                        {/* Operations Summary Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
                            <p className="text-sm font-bold text-slate-900 dark:text-white mb-4">Operations Summary</p>
                            <div className="space-y-4">
                                {[
                                    { label: 'Pending Handovers',   value: confirmedCount, color: 'bg-blue-600',    note: 'Ready for pickup' },
                                    { label: 'Active Rentals',       value: activeCount,    color: 'bg-emerald-600', note: 'Currently on road' },
                                    { label: 'Pending Approvals',    value: pendingCount,   color: 'bg-amber-500',   note: 'Awaiting dealer' },
                                    { label: 'Completed Rentals',    value: completedCount, color: 'bg-slate-400',   note: 'Successfully returned' },
                                ].map((row) => (
                                    <div key={row.label} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <span className={`w-2.5 h-2.5 rounded-full ${row.color}`} />
                                            <div>
                                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{row.label}</p>
                                                <p className="text-[10px] text-slate-400">{row.note}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-black text-slate-900 dark:text-white">{row.value}</span>
                                    </div>
                                ))}
                                <div className="pt-3 mt-1 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Rental Value</p>
                                    <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">₹{totalAmount.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Booking Coordination Table ── */}
                {loading ? <TableSkeleton rows={6} cols={5} /> : (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Customer Bookings & Handover Coordination</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">All bookings assigned to you for coordination</p>
                        </div>

                        {bookings.length === 0 ? (
                            <DashboardEmptyState
                                icon={<CalendarCheck className="w-7 h-7" />}
                                title="No bookings assigned"
                                description="Booking assignments from the admin will appear here for coordination."
                            />
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {bookings.map((b) => {
                                    const custName   = b.customerDetails?.name || b.userId?.name || 'Unknown';
                                    const custPhone  = b.customerDetails?.phone || b.userId?.phone || '—';
                                    const vehicle    = b.carId?.vehicleDetails
                                        ? `${b.carId.vehicleDetails.brand} ${b.carId.vehicleDetails.model}`
                                        : 'N/A';
                                    const regNo      = b.carId?.vehicleDetails?.registrationNumber || '';
                                    const pickup     = b.pickupDate ? new Date(b.pickupDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';
                                    const ret        = b.returnDate ? new Date(b.returnDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';
                                    const amount     = b.rentalAmount ?? 0;

                                    return (
                                        <div key={b._id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                                            {/* Left – Booking Info */}
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400">
                                                        {b.bookingId || b._id?.slice(-8).toUpperCase()}
                                                    </span>
                                                    <StatusBadge status={b.bookingStatus} size="sm" />
                                                </div>

                                                <div className="flex items-start gap-2">
                                                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center font-black text-sm shrink-0">
                                                        {custName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-900 dark:text-white">{custName}</p>
                                                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                                            <Phone className="w-3 h-3" /> {custPhone}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                                                    <Car className="w-3.5 h-3.5 shrink-0" />
                                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{vehicle}</span>
                                                    {regNo && <span className="text-slate-400">· {regNo}</span>}
                                                </div>

                                                {b.pickupLocation && (
                                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                                                        {b.pickupLocation}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right – Dates + Amount */}
                                            <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
                                                <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                                    {pickup} <span className="text-slate-400 mx-1">→</span> {ret}
                                                </div>
                                                <p className="text-base font-black text-indigo-600 dark:text-indigo-400">
                                                    ₹{Number(amount).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default AgentDashboard;
