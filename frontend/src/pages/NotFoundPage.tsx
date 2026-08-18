import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-8 text-center space-y-5 bg-gray-50/50 dark:bg-[#070a0f] transition-colors">
      <div className="w-20 h-20 rounded-3xl bg-brand-500/10 text-brand-500 flex items-center justify-center shadow-neon">
        <Dumbbell className="w-10 h-10" />
      </div>
      <div className="space-y-2">
        <h1 className="font-display text-5xl sm:text-6xl font-black text-gray-900 dark:text-white">
          404
        </h1>
        <h2 className="font-display text-xl font-bold text-gray-800 dark:text-gray-200">
          Page Lost in the Gym Locker Room
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto">
          The page you requested could not be found. Let's get you back on track to hitting your daily macros!
        </p>
      </div>

      <Link
        to="/"
        className="flex items-center gap-2 px-8 py-3.5 bg-brand-500 text-black font-black text-xs sm:text-sm rounded-2xl hover:bg-brand-400 shadow-neon transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
};
