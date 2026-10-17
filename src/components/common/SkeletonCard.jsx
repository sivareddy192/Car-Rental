import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-zinc-100 dark:bg-zinc-900" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
        <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
        <div className="grid grid-cols-3 gap-2 py-2">
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-900 flex justify-between items-center">
          <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-20" />
        </div>
      </div>
    </div>
  );
};
