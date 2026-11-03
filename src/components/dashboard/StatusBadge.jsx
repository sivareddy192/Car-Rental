import React from 'react';

/**
 * Universal status badge for bookings, vehicles, applications.
 * status: any booking/vehicle/application status string
 */
const statusConfig = {
    // Booking statuses
    pending_owner_approval: { label: 'Pending Approval', bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500', pulse: true },
    pending:                { label: 'Pending',          bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500', pulse: true },
    confirmed:              { label: 'Confirmed',        bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
    active_rental:          { label: 'Active Rental',    bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500', pulse: true },
    active:                 { label: 'Active',           bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500', pulse: true },
    in_progress:            { label: 'In Progress',      bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500', pulse: true },
    completed:              { label: 'Completed',        bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-300', dot: 'bg-slate-400' },
    rejected:               { label: 'Rejected',         bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-500' },
    cancelled:              { label: 'Cancelled',        bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500 dark:text-slate-400', dot: 'bg-slate-400' },
    // Vehicle statuses
    approved:               { label: 'Approved',         bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
    pending_approval:       { label: 'Pending Review',   bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500', pulse: true },
    suspended:              { label: 'Suspended',        bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-500' },
    // Application statuses
    under_review:           { label: 'Under Review',     bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-600 dark:text-indigo-400', dot: 'bg-indigo-500', pulse: true },
};

const StatusBadge = ({ status, size = 'md' }) => {
    const cfg = statusConfig[status] || {
        label: String(status || '').replace(/_/g, ' '),
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-600 dark:text-slate-300',
        dot: 'bg-slate-400',
    };

    const sizeClass = size === 'sm'
        ? 'text-[10px] px-2 py-0.5'
        : 'text-[11px] px-2.5 py-1';

    return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full capitalize ${sizeClass} ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${cfg.pulse ? 'animate-pulse' : ''}`} />
            {cfg.label}
        </span>
    );
};

export default StatusBadge;

