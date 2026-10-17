import React from 'react';

export const LoadingSpinner = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-zinc-700 border-t-white animate-spin`}
      />
      {text && <p className="text-xs text-zinc-400 font-medium tracking-wider uppercase">{text}</p>}
    </div>
  );
};
