import React from 'react';

/**
 * Universal skeleton loader for dashboard cards/tables.
 * type: 'card' | 'table' | 'stat'
 * count: number of items
 */
const SkeletonBox = ({ h = 'h-4', w = 'w-full', rounded = 'rounded-lg' }) => (
    <div className={`${h} ${w} ${rounded} bg-slate-200 dark:bg-slate-700 animate-pulse`} />
);

export const StatSkeleton = ({ count = 4 }) => (
    <div className={`grid grid-cols-2 sm:grid-cols-${Math.min(count, 4)} gap-4`}>
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                <SkeletonBox h="h-11" w="w-11" rounded="rounded-xl" />
                <SkeletonBox h="h-7" w="w-24" />
                <SkeletonBox h="h-3" w="w-32" />
            </div>
        ))}
    </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <SkeletonBox h="h-5" w="w-40" />
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                    <SkeletonBox h="h-8" w="w-8" rounded="rounded-full" />
                    {Array.from({ length: cols - 1 }).map((_col, j) => (
                        <SkeletonBox key={j} h="h-3.5" w={j === 0 ? 'w-32' : j === 1 ? 'w-24' : 'w-16'} />
                    ))}
                </div>
            ))}
        </div>
    </div>
);

export const ChartSkeleton = ({ h = 'h-64' }) => (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 ${h} flex flex-col gap-4`}>
        <div className="flex items-center justify-between">
            <SkeletonBox h="h-5" w="w-32" />
            <SkeletonBox h="h-7" w="w-24" rounded="rounded-lg" />
        </div>
        <div className="flex-1 flex items-end gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex-1 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-t-sm" style={{ height: `${30 + ((i * 17) % 60)}%` }} />
            ))}
        </div>
    </div>
);
