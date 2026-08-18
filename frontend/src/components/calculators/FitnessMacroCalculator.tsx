import React, { useState, useEffect } from 'react';
import { Activity, Flame, Heart, Zap, Sparkles, Scale, Info } from 'lucide-react';
import { calculatorService } from '../../services/calculator.service';
import { useAuth } from '../../context/AuthContext';

export const FitnessMacroCalculator: React.FC = () => {
  const { user } = useAuth();

  const [age, setAge] = useState<number>(user?.proteinGoal?.age || 26);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(
    (user?.proteinGoal?.gender as any) || 'male'
  );
  const [weight, setWeight] = useState<number>(user?.weight || 75);
  const [height, setHeight] = useState<number>(user?.height || 178);
  const [activityLevel, setActivityLevel] = useState<string>('very_active');
  const [goal, setGoal] = useState<string>('muscle_gain');

  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const data = await calculatorService.calculateFitnessMetrics({
        age,
        gender,
        weight,
        height,
        activityLevel,
        goal,
      });
      setMetrics(data);
    } catch (error) {
      console.error('Metrics calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculate();
  }, [age, gender, weight, height, activityLevel, goal]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Controls Form */}
      <div className="lg:col-span-6 bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-500">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
              Body & Macro Calculator
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Calculate BMI, Basal Metabolic Rate (BMR), TDEE, and daily macro targets.
            </p>
          </div>
        </div>

        {/* Gender Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Gender
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['male', 'female', 'other'] as const).map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => setGender(g)}
                className={`py-3 rounded-xl text-xs font-bold capitalize transition border ${
                  gender === g
                    ? 'bg-cyan-500 text-black border-cyan-400 shadow-neon'
                    : 'bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-800'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-400 uppercase tracking-wider">Weight</span>
              <span className="text-cyan-500 font-display text-sm">{weight} kg</span>
            </div>
            <input
              type="range"
              min={35}
              max={160}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-400 uppercase tracking-wider">Height</span>
              <span className="text-cyan-500 font-display text-sm">{height} cm</span>
            </div>
            <input
              type="range"
              min={120}
              max={220}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Age */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className="text-gray-400 uppercase tracking-wider">Age</span>
            <span className="text-cyan-500 font-display text-sm">{age} Years</span>
          </div>
          <input
            type="range"
            min={14}
            max={80}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Target Goal */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Target Goal
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'muscle_gain', label: 'Lean Bulk' },
              { id: 'weight_loss', label: 'Fat Shred (Deficit)' },
              { id: 'weight_gain', label: 'Aggressive Bulk' },
              { id: 'maintenance', label: 'Maintain Weight' },
              { id: 'athlete', label: 'Endurance / Athlete' },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setGoal(item.id)}
                className={`p-3 rounded-xl text-xs font-bold transition text-left border ${
                  goal === item.id
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/50'
                    : 'bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Activity Level
          </label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm p-3.5 rounded-xl border border-gray-200 dark:border-slate-800 font-semibold"
          >
            <option value="sedentary">Sedentary (Desk Job, little or no exercise)</option>
            <option value="light">Lightly Active (Workouts 1-3 times/week)</option>
            <option value="moderate">Moderately Active (Workouts 3-5 times/week)</option>
            <option value="very_active">Very Active (Intense training 6-7 days/week)</option>
            <option value="extra_active">Extra Active (Intense athlete training 2x/day)</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {metrics && (
        <div className="lg:col-span-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* BMI Card */}
            <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl text-center space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Body Mass Index (BMI)
              </div>
              <div className="font-display text-3xl font-black text-gray-900 dark:text-white">
                {metrics.bmi.value}
              </div>
              <span
                className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: `${metrics.bmi.color}20`, color: metrics.bmi.color }}
              >
                {metrics.bmi.category}
              </span>
            </div>

            {/* BMR Card */}
            <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl text-center space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Basal Metabolic Rate
              </div>
              <div className="font-display text-3xl font-black text-cyan-400">
                {metrics.bmr}
              </div>
              <div className="text-[11px] text-gray-400 font-semibold">kcal at pure rest</div>
            </div>

            {/* TDEE Card */}
            <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl text-center space-y-1 col-span-2 sm:col-span-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Maintenance (TDEE)
              </div>
              <div className="font-display text-3xl font-black text-amber-400">
                {metrics.tdee}
              </div>
              <div className="text-[11px] text-gray-400 font-semibold">kcal / day</div>
            </div>
          </div>

          {/* Target Daily Caloric Intake Banner */}
          <div className="bg-gradient-to-r from-cyan-950 via-[#0d1c26] to-[#0a1219] p-6 sm:p-8 rounded-3xl border border-cyan-500/40 shadow-2xl space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-wider text-cyan-400">
              Target Daily Calorie Intake For Your Goal
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl sm:text-6xl font-black text-white">
                {metrics.targetCalories}
              </span>
              <span className="text-xl font-bold text-cyan-400 font-display">kcal/day</span>
            </div>
            <p className="text-xs text-gray-400">
              Target calories configured specifically for <strong>{goal.replace('_', ' ').toUpperCase()}</strong>.
            </p>
          </div>

          {/* Macronutrient Split Cards */}
          <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-6">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              Daily Macronutrient Split Target
            </h4>

            {/* Visual Multi-Color Bar */}
            <div className="space-y-2">
              <div className="w-full h-4 rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
                <div
                  className="h-full bg-brand-500 shadow-neon"
                  style={{ width: `${metrics.macros.protein.percent}%` }}
                />
                <div
                  className="h-full bg-cyan-400"
                  style={{ width: `${metrics.macros.carbs.percent}%` }}
                />
                <div
                  className="h-full bg-purple-400"
                  style={{ width: `${metrics.macros.fat.percent}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] font-bold text-gray-400 px-1">
                <span className="text-brand-500">Protein: {metrics.macros.protein.percent}%</span>
                <span className="text-cyan-400">Carbs: {metrics.macros.carbs.percent}%</span>
                <span className="text-purple-400">Fats: {metrics.macros.fat.percent}%</span>
              </div>
            </div>

            {/* Macro Detail Cards */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-2xl">
                <div className="text-[11px] font-bold text-brand-400 uppercase">Protein</div>
                <div className="font-display text-2xl font-black text-gray-900 dark:text-white mt-1">
                  {metrics.macros.protein.grams}g
                </div>
                <div className="text-[10px] text-gray-400">{metrics.macros.protein.calories} kcal</div>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 p-3.5 rounded-2xl">
                <div className="text-[11px] font-bold text-cyan-400 uppercase">Carbohydrates</div>
                <div className="font-display text-2xl font-black text-gray-900 dark:text-white mt-1">
                  {metrics.macros.carbs.grams}g
                </div>
                <div className="text-[10px] text-gray-400">{metrics.macros.carbs.calories} kcal</div>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 p-3.5 rounded-2xl">
                <div className="text-[11px] font-bold text-purple-400 uppercase">Healthy Fats</div>
                <div className="font-display text-2xl font-black text-gray-900 dark:text-white mt-1">
                  {metrics.macros.fat.grams}g
                </div>
                <div className="text-[10px] text-gray-400">{metrics.macros.fat.calories} kcal</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
