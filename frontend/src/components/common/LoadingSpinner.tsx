import React from 'react';
import { Dumbbell } from 'lucide-react';

export const LoadingSpinner: React.FC<{ message?: string; fullPage?: boolean }> = ({
  message = 'Loading...',
  fullPage = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-slate-700 border-t-brand-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-brand-500">
          <Dumbbell className="w-6 h-6 animate-pulse" />
        </div>
      </div>
      <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase animate-pulse">
        {message}
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center w-full">
        {content}
      </div>
    );
  }

  return content;
};
