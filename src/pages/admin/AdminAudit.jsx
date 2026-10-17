import React, { useEffect, useState } from 'react';
import { Activity, Shield, Search, Clock } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

const actionColors = {
  CREATE: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200/80 dark:border-emerald-500/20',
  UPDATE: 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border-sky-200/80 dark:border-sky-500/20',
  DELETE: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200/80 dark:border-rose-500/20',
  LOGIN: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200/80 dark:border-amber-500/20',
  LOGOUT: 'text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-[#0f121d] border-slate-200 dark:border-white/[0.08]',
};

const getActionColor = (action) => {
  const key = Object.keys(actionColors).find((k) => action?.toUpperCase().includes(k));
  return actionColors[key] || 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200/80 dark:border-purple-500/20';
};

export const AdminAudit = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/audit-logs')
      .then((res) => {
        if (res.data.success) setLogs(res.data.logs || []);
      })
      .catch(() => toast.error('Failed to load audit logs.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter((log) => {
    const q = search.toLowerCase();
    return (
      !q ||
      log.action?.toLowerCase().includes(q) ||
      JSON.stringify(log.details)?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner text="Loading immutable audit trail..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-[#141724] border border-slate-200/90 dark:border-white/[0.08] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              Compliance & Security
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-serif">
            System Audit Trail
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total {logs.length} administrative events permanently recorded
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search action or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0f121d] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:outline-none focus:bg-white dark:focus:bg-[#181c2c] focus:border-amber-500"
          />
        </div>
      </div>

      {/* Info notice */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-blue-50/80 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-900 dark:text-blue-300 shadow-xs">
        <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <p className="text-xs text-blue-800 dark:text-blue-300 font-medium">
          All administrative actions, data edits, and logins are recorded in this immutable audit log for compliance.
        </p>
      </div>

      {/* Action types filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {Object.entries(actionColors).map(([key, cls]) => (
          <span
            key={key}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-xs ${cls}`}
          >
            {key}
          </span>
        ))}
      </div>

      {/* Timeline List */}
      <div className="bg-white dark:bg-[#141724] border border-slate-200/90 dark:border-white/[0.08] rounded-2xl shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
          {filtered.map((log, i) => (
            <div
              key={log._id || i}
              className="flex items-start gap-4 px-6 py-4.5 hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors"
            >
              {/* Icon badge */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border shadow-xs ${getActionColor(
                  log.action
                )}`}
              >
                <Activity className="w-4 h-4" />
              </div>

              {/* Event Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap mb-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getActionColor(
                      log.action
                    )}`}
                  >
                    {log.action}
                  </span>
                  {log.userId && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      by {log.userId?.name || log.userId}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-auto flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {new Date(log.createdAt || Date.now()).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {log.details && (
                  <pre className="text-[11px] text-slate-700 dark:text-slate-300 font-mono bg-slate-50 dark:bg-[#0f121d] p-2.5 rounded-xl border border-slate-200/80 dark:border-white/[0.06] overflow-x-auto whitespace-pre-wrap mt-2">
                    {typeof log.details === 'object'
                      ? JSON.stringify(log.details, null, 2)
                      : log.details}
                  </pre>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Activity className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">No audit events match current criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAudit;
