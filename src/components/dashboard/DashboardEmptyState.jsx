import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Empty state for dashboard tables/sections.
 * Props: icon, title, description, action (JSX button)
 */
const DashboardEmptyState = ({ icon, title = 'No data yet', description, action }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        {icon ? (
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
                {icon}
            </div>
        ) : (
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
                <AlertCircle className="w-7 h-7" />
            </div>
        )}
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{title}</p>
        {description && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 max-w-xs">{description}</p>
        )}
        {action && <div className="mt-5">{action}</div>}
    </div>
);

export default DashboardEmptyState;

