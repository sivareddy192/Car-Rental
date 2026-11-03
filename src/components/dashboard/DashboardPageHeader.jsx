import React from 'react';

/**
 * Reusable page header for dashboard pages.
 * Props:
 *   title        – string
 *   subtitle     – string
 *   actions      – JSX (right-aligned buttons/controls)
 *   badge        – string (optional pill badge near title)
 *   badgeColor   – 'blue'|'emerald'|'amber'|'indigo' (default: blue)
 */
const badgeColors = {
    blue:    'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300',
    emerald: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300',
    amber:   'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300',
    indigo:  'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300',
    orange:  'bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300',
};

const DashboardPageHeader = ({ title, subtitle, actions, badge, badgeColor = 'blue' }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    {title}
                </h1>
                {badge && (
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${badgeColors[badgeColor] || badgeColors.blue}`}>
                        {badge}
                    </span>
                )}
            </div>
            {subtitle && (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                    {subtitle}
                </p>
            )}
        </div>
        {actions && (
            <div className="flex items-center gap-2 flex-wrap shrink-0">
                {actions}
            </div>
        )}
    </div>
);

export default DashboardPageHeader;

