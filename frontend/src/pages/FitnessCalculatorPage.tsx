import React from 'react';
import { FitnessMacroCalculator } from '../components/calculators/FitnessMacroCalculator';
import { Activity, Flame, Heart, Zap } from 'lucide-react';

export const FitnessCalculatorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>Comprehensive Body Metric Engine</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">
            BMI / BMR / TDEE & Macro Calculator
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Calculate your Body Mass Index (BMI), Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), and daily protein, carbohydrate, and fat splits.
          </p>
        </div>

        {/* Main Fitness Calculator */}
        <FitnessMacroCalculator />
      </div>
    </div>
  );
};
