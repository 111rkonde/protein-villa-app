import React from 'react';
import { ProteinGoalCalculator } from '../components/calculators/ProteinGoalCalculator';
import { Flame, ShieldCheck, Award, Zap } from 'lucide-react';

export const ProteinCalculatorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-brand-500 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            <span>Sports Nutrition Science Standard</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">
            Daily Protein Goal Calculator
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Calculate your exact daily protein requirement in grams, recommended per-meal distribution, and targeted supplement stacks matching your specific fitness goal.
          </p>
        </div>

        {/* Main Calculator Component */}
        <ProteinGoalCalculator />

        {/* Informational Guidance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-slate-800">
          <div className="p-6 bg-white dark:bg-dark-surface rounded-3xl border border-gray-200 dark:border-slate-800 space-y-2">
            <div className="p-3 bg-emerald-500/10 text-brand-500 rounded-2xl w-fit">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">ISSN Scientific Formula</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Based on the International Society of Sports Nutrition (ISSN) guidelines of 1.6 - 2.4g protein per kg for resistance trained individuals.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-dark-surface rounded-3xl border border-gray-200 dark:border-slate-800 space-y-2">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl w-fit">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">Per-Meal Distribution</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Spacing protein into 25-45g portions across 4-5 meals optimizes muscle protein synthesis (MPS) spikes throughout the day.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-dark-surface rounded-3xl border border-gray-200 dark:border-slate-800 space-y-2">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">Save Directly to Profile</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Save your calculated targets to sync automatically with your Daily Protein Tracker and live streak metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
