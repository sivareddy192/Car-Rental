import React, { useState, useEffect, useCallback } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import {
    ShieldAlert,
    ShieldCheck,
    AlertTriangle,
    Lock,
    RefreshCw,
    Filter,
    Activity,
    CheckCircle2,
    Database,
    Zap,
    Clock
} from 'lucide-react';
import { TableSkeleton } from '../components/dashboard/DashboardSkeleton';

export default function AdminSecurityMonitor() {
    const [logs, setLogs] = useState([]);
    const [summary, setSummary] = useState({ totalEvents: 0, critical: 0, high: 0, medium: 0, low: 0 });
    const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [selectedSeverity, setSelectedSeverity] = useState('all');
    const [selectedEventType, setSelectedEventType] = useState('all');

    const fetchLogs = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: '15'
            });
            if (selectedSeverity !== 'all') params.set('severity', selectedSeverity);
            if (selectedEventType !== 'all') params.set('eventType', selectedEventType);

            const res = await Axios.get(`${SummaryApi.adminPlatform.securityLogs.url}?${params.toString()}`);
            if (res.data?.success) {
                setLogs(res.data.data || []);
                setSummary(res.data.summary || { totalEvents: 0, critical: 0, high: 0, medium: 0, low: 0 });
                setPagination(res.data.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setLoading(false);
        }
    }, [selectedSeverity, selectedEventType]);

    useEffect(() => {
        fetchLogs(1);
    }, [fetchLogs]);

    const getSeverityBadge = (severity) => {
        switch (severity) {
            case 'critical':
                return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-400 border border-rose-300 dark:border-rose-800">Critical</span>;
            case 'high':
                return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-400 border border-amber-300 dark:border-amber-800">High</span>;
            case 'medium':
                return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-400 border border-sky-300 dark:border-sky-800">Medium</span>;
            default:
                return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">Low</span>;
        }
    };

    const getActionBadge = (action) => {
        if (action === 'blocked' || action === 'rate_limited') {
            return (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    <Lock className="w-3 h-3" />
                    {action === 'blocked' ? 'Blocked' : 'Rate Limited'}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                Logged
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
                            Security Incident & Audit Monitor
                        </h1>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Real-time threat detection, automated rate-limit enforcement, NoSQL injection interception, and audit tracking.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => fetchLogs(pagination.page)}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh Logs</span>
                </button>
            </div>

            {/* Stat Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Incidents</span>
                        <Activity className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                        {summary.totalEvents}
                    </p>
                    <span className="text-[10px] text-slate-400">Monitored across all routes</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">Critical / High</span>
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                    </div>
                    <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">
                        {(summary.critical || 0) + (summary.high || 0)}
                    </p>
                    <span className="text-[10px] text-slate-400">Urgent threats intercepted</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Medium Alerts</span>
                        <Zap className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
                        {summary.medium || 0}
                    </p>
                    <span className="text-[10px] text-slate-400">Rate limits & invalid auth</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Protection Status</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Active & Guarded
                    </p>
                    <span className="text-[10px] text-slate-400">NoSQL & Rate Guard On</span>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex flex-wrap items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400 ml-1" />
                    <span className="text-xs font-bold text-slate-500 mr-2">Severity:</span>
                    {['all', 'critical', 'high', 'medium', 'low'].map(s => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setSelectedSeverity(s)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                                selectedSeverity === s
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Event:</span>
                    <select
                        value={selectedEventType}
                        onChange={(e) => setSelectedEventType(e.target.value)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden cursor-pointer"
                    >
                        <option value="all">All Events</option>
                        <option value="NOSQL_INJECTION_ATTEMPT">NoSQL Injections</option>
                        <option value="AUTH_RATE_LIMIT_EXCEEDED">Rate Limits</option>
                        <option value="LOGIN_FAILED">Login Failures</option>
                        <option value="IDOR_ATTEMPT">IDOR Violations</option>
                        <option value="SUSPICIOUS_PAYLOAD">Suspicious Payload</option>
                    </select>
                </div>
            </div>

            {/* Incident Logs Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                {loading ? (
                    <div className="p-6">
                        <TableSkeleton rows={5} cols={5} />
                    </div>
                ) : logs.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                        <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-80" />
                        <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">No Security Incidents Detected</h3>
                        <p className="text-xs text-slate-400 mt-1">All incoming API requests match normal operational parameters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                                <tr>
                                    <th className="px-4 py-3">Timestamp</th>
                                    <th className="px-4 py-3">Severity</th>
                                    <th className="px-4 py-3">Event Type</th>
                                    <th className="px-4 py-3">Client IP & Route</th>
                                    <th className="px-4 py-3">Reason</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                {logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                                        <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                                            <div className="flex items-center gap-1 text-[11px]">
                                                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                                                {new Date(log.timestamp).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {getSeverityBadge(log.severity)}
                                        </td>
                                        <td className="px-4 py-3 font-mono font-bold text-[11px] text-slate-900 dark:text-slate-100">
                                            {log.eventType}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-mono text-[11px] text-slate-900 dark:text-white">
                                                {log.ipAddress}
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                <span className="font-bold text-blue-600">{log.method}</span> {log.endpoint}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 max-w-xs truncate text-[11px] text-slate-600 dark:text-slate-400" title={log.detectionReason}>
                                            {log.detectionReason}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {getActionBadge(log.actionTaken)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                    <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={pagination.page <= 1}
                                onClick={() => fetchLogs(pagination.page - 1)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold disabled:opacity-40"
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                disabled={pagination.page >= pagination.totalPages}
                                onClick={() => fetchLogs(pagination.page + 1)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

