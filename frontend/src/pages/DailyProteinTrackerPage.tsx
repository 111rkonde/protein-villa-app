import React from 'react';
import { DailyTrackerWidget } from '../components/tracker/DailyTrackerWidget';
import { Flame, Trophy, Award } from 'lucide-react';

export const DailyProteinTrackerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
            Daily Fitness Dashboard
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mt-1">
            Daily Protein & Streak Tracker
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Log your shakes and meals, monitor your daily progress ring, and build an unbroken weekly fitness streak.
          </p>
        </div>

        <DailyTrackerWidget />
      </div>
    </div>
  );
};
