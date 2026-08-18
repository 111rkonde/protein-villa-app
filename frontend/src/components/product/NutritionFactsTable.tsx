import React from 'react';
import { NutritionInfo } from '../../types';
import { Flame, Activity, Zap, CheckCircle2 } from 'lucide-react';

export const NutritionFactsTable: React.FC<{ nutrition: NutritionInfo }> = ({ nutrition }) => {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b-2 border-gray-900 dark:border-white">
        <div>
          <h3 className="font-display text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            Nutrition Facts
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Serving Size: <strong>{nutrition.servingSize}</strong>
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20">
            {nutrition.servingsPerContainer} Servings
          </span>
        </div>
      </div>

      {/* Main Macro Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 text-center">
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase flex items-center justify-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Protein
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white font-display mt-1">
            {nutrition.protein}g
          </div>
          <div className="text-[10px] text-gray-400">Per Serving</div>
        </div>

        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3.5 text-center">
          <div className="text-xs text-orange-600 dark:text-orange-400 font-bold uppercase flex items-center justify-center gap-1">
            <Flame className="w-3.5 h-3.5" /> Calories
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white font-display mt-1">
            {nutrition.calories}
          </div>
          <div className="text-[10px] text-gray-400">kcal</div>
        </div>

        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3.5 text-center">
          <div className="text-xs text-cyan-600 dark:text-cyan-400 font-bold uppercase flex items-center justify-center gap-1">
            <Activity className="w-3.5 h-3.5" /> Carbs
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white font-display mt-1">
            {nutrition.carbs}g
          </div>
          <div className="text-[10px] text-gray-400">Clean Carbs</div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3.5 text-center">
          <div className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase flex items-center justify-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Total Fat
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white font-display mt-1">
            {nutrition.fat}g
          </div>
          <div className="text-[10px] text-gray-400">Low Fat</div>
        </div>
      </div>

      {/* Detailed Macro Breakdown Table */}
      <div className="space-y-2 text-xs divide-y divide-gray-100 dark:divide-slate-800">
        <div className="flex justify-between py-2 font-bold text-gray-900 dark:text-white">
          <span>Amount Per Serving</span>
          <span>% Daily Value*</span>
        </div>
        <div className="flex justify-between py-1.5 text-gray-700 dark:text-gray-300 font-semibold">
          <span>Pure Native Protein</span>
          <span className="font-bold text-brand-500">{nutrition.protein}g (56%)</span>
        </div>
        <div className="flex justify-between py-1.5 text-gray-600 dark:text-gray-400">
          <span>Total Carbohydrate</span>
          <span>{nutrition.carbs}g (1%)</span>
        </div>
        <div className="flex justify-between py-1.5 text-gray-600 dark:text-gray-400 pl-4">
          <span>Dietary Sugars</span>
          <span>0g (0%)</span>
        </div>
        <div className="flex justify-between py-1.5 text-gray-600 dark:text-gray-400">
          <span>Total Fat</span>
          <span>{nutrition.fat}g (1%)</span>
        </div>
        {nutrition.bcaa && (
          <div className="flex justify-between py-1.5 text-cyan-600 dark:text-cyan-400 font-bold">
            <span>BCAAs (Leucine, Isoleucine, Valine)</span>
            <span>{nutrition.bcaa}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 text-[11px] text-gray-400 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
        <span>*Percent Daily Values are based on a 2,000 calorie diet for active adults.</span>
      </div>
    </div>
  );
};
