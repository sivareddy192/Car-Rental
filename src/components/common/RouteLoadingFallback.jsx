import React from 'react';

const RouteLoadingFallback = () => (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-start pt-16 px-4">
        {/* Top Progress Line */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 z-50 overflow-hidden">
            <div className="h-full bg-blue-600 animate-[pulse_1s_infinite] w-full" />
        </div>

        {/* Content Skeleton */}
        <div className="w-full max-w-6xl space-y-6">
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-4 w-96 bg-slate-100 dark:bg-slate-800/60 rounded-lg animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                        <div className="h-44 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default RouteLoadingFallback;

