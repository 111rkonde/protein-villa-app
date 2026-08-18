import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl p-4 border border-gray-200 dark:border-slate-800 shadow-sm animate-pulse space-y-4">
      <div className="w-full h-48 bg-gray-200 dark:bg-slate-800 rounded-xl" />
      <div className="space-y-2">
        <div className="w-20 h-4 bg-gray-200 dark:bg-slate-800 rounded" />
        <div className="w-full h-5 bg-gray-200 dark:bg-slate-800 rounded" />
        <div className="w-2/3 h-4 bg-gray-200 dark:bg-slate-800 rounded" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="w-24 h-6 bg-gray-200 dark:bg-slate-800 rounded" />
        <div className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-14 bg-gray-100 dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-slate-800"
        />
      ))}
    </div>
  );
};
