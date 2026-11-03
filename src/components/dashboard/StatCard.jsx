import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Reusable stat card for all dashboards.
 * Props:
 *   label        – string
 *   value        – number | string
 *   icon         – JSX element
 *   color        – 'blue'|'emerald'|'amber'|'indigo'|'rose'|'violet'|'cyan'|'orange'
 *   trend        – 'up'|'down'|'flat' (optional)
 *   trendValue   – string, e.g. "+12%" (optional)
 *   loading      – boolean
 *   onClick      – function (optional)
 */
const colorMap = {
    blue:    { bg: 'bg-blue-50 dark:bg-blue-950/40',    text: 'text-blue-600 dark:text-blue-400',    border: 'border-blue-100 dark:border-blue-900/50',    badge: 'bg-blue-600' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-900/50', badge: 'bg-emerald-600' },
    amber:   { bg: 'bg-amber-50 dark:bg-amber-950/40',  text: 'text-amber-600 dark:text-amber-400',  border: 'border-amber-100 dark:border-amber-900/50',  badge: 'bg-amber-500' },
    indigo:  { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-900/50', badge: 'bg-indigo-600' },
    rose:    { bg: 'bg-rose-50 dark:bg-rose-950/40',    text: 'text-rose-600 dark:text-rose-400',    border: 'border-rose-100 dark:border-rose-900/50',    badge: 'bg-rose-600' },
    violet:  { bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-100 dark:border-violet-900/50', badge: 'bg-violet-600' },
    cyan:    { bg: 'bg-cyan-50 dark:bg-cyan-950/40',    text: 'text-cyan-600 dark:text-cyan-400',    border: 'border-cyan-100 dark:border-cyan-900/50',    badge: 'bg-cyan-600' },
    orange:  { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-100 dark:border-orange-900/50', badge: 'bg-orange-600' },
};

const StatCard = ({ label, value, icon, color = 'blue', trend, trendValue, loading, onClick }) => {
    const c = colorMap[color] || colorMap.blue;

    return (
        <div
            onClick={onClick}
            className={`group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700' : ''}`}
        >
            {/* Top row */}
            <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.bg} ${c.text}`}>
                    {icon}
                </div>
                {trend && (
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg ${
                        trend === 'up'   ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' :
                        trend === 'down' ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                        {trend === 'up'   ? <TrendingUp className="w-3 h-3" /> :
                         trend === 'down' ? <TrendingDown className="w-3 h-3" /> :
                         <Minus className="w-3 h-3" />}
                        {trendValue}
                    </span>
                )}
            </div>

            {/* Value */}
            {loading ? (
                <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mb-1.5" />
            ) : (
                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                    {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
                </p>
            )}

            {/* Label */}
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {label}
            </p>

            {/* Bottom color accent line */}
            <div className={`absolute bottom-0 left-6 right-6 h-0.5 rounded-full ${c.badge} opacity-0 group-hover:opacity-30 transition-opacity`} />
        </div>
    );
};

export default StatCard;

