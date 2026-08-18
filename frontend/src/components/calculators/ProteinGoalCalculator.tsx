import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Dumbbell, ShieldAlert, Sparkles, Check, ArrowRight, Save, Info } from 'lucide-react';
import { calculatorService } from '../../services/calculator.service';
import { trackerService } from '../../services/tracker.service';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ProteinGoalCalculator: React.FC = () => {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [age, setAge] = useState<number>(user?.proteinGoal?.age || 25);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(
    (user?.proteinGoal?.gender as any) || 'male'
  );
  const [weight, setWeight] = useState<number>(user?.weight || user?.proteinGoal?.weight || 75);
  const [height, setHeight] = useState<number>(user?.height || user?.proteinGoal?.height || 178);
  const [activityLevel, setActivityLevel] = useState<string>(
    user?.activityLevel || user?.proteinGoal?.activityLevel || 'very_active'
  );
  const [goal, setGoal] = useState<string>(
    user?.fitnessGoal || user?.proteinGoal?.goal || 'muscle_gain'
  );

  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const calculate = async () => {
    setIsCalculating(true);
    try {
      const data = await calculatorService.calculateProtein({
        age,
        gender,
        weight,
        height,
        activityLevel,
        goal,
      });
      setResult(data);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    calculate();
  }, [age, gender, weight, height, activityLevel, goal]);

  const handleSaveToProfile = async () => {
    if (!isAuthenticated) {
      showToast('Please log in to save your protein goal to your profile.', 'info');
      return;
    }

    if (!result) return;

    setIsSaving(true);
    try {
      await trackerService.saveGoal({
        weight,
        height,
        age,
        gender,
        activityLevel,
        goal,
        dailyTargetGrams: result.dailyProteinGoal,
        minRangeGrams: result.minRequirement,
        maxRangeGrams: result.maxRecommendedRange,
        perMealBreakdown: result.perMealBreakdown,
      });
      await refreshUser();
      showToast('Protein Goal saved to your profile! 🏆', 'success');
    } catch (error: any) {
      showToast('Failed to save goal.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Input Form Controls */}
      <div className="lg:col-span-6 bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-brand-500">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
              Daily Protein Goal Calculator
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ISSN sports nutrition standard calculation based on weight, activity, and goals.
            </p>
          </div>
        </div>

        {/* Gender Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Biological Gender
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['male', 'female', 'other'] as const).map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => setGender(g)}
                className={`py-3 rounded-xl text-xs font-bold capitalize transition border ${
                  gender === g
                    ? 'bg-brand-500 text-black border-brand-400 shadow-neon'
                    : 'bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-800'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Weight & Height Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-400 uppercase tracking-wider">Body Weight</span>
              <span className="text-brand-500 font-display text-sm">{weight} kg</span>
            </div>
            <input
              type="range"
              min={35}
              max={160}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-400 uppercase tracking-wider">Height</span>
              <span className="text-brand-500 font-display text-sm">{height} cm</span>
            </div>
            <input
              type="range"
              min={120}
              max={220}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Age */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className="text-gray-400 uppercase tracking-wider">Age</span>
            <span className="text-brand-500 font-display text-sm">{age} Years</span>
          </div>
          <input
            type="range"
            min={14}
            max={80}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full accent-brand-500 cursor-pointer"
          />
        </div>

        {/* Primary Fitness Goal */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Primary Fitness Goal
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'muscle_gain', label: 'Muscle Gain' },
              { id: 'weight_loss', label: 'Fat Loss' },
              { id: 'weight_gain', label: 'Weight Bulk' },
              { id: 'athlete', label: 'Athlete' },
              { id: 'maintenance', label: 'Maintenance' },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setGoal(item.id)}
                className={`p-3 rounded-xl text-xs font-bold transition text-left border ${
                  goal === item.id
                    ? 'bg-brand-500/10 text-brand-500 border-brand-500/50 shadow-neon'
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
            Weekly Activity Level
          </label>
          <div className="space-y-1.5">
            {[
              { id: 'sedentary', title: 'Sedentary', desc: 'Little to no structured exercise' },
              { id: 'light', title: 'Light Active', desc: 'Light workouts 1-3 days/week' },
              { id: 'moderate', title: 'Moderately Active', desc: 'Weightlifting 3-5 days/week' },
              { id: 'very_active', title: 'Very Active', desc: 'Intense training 6-7 days/week' },
              { id: 'extra_active', title: 'Hardcore Athlete', desc: 'Double daily sessions or physical job' },
            ].map((act) => (
              <label
                key={act.id}
                onClick={() => setActivityLevel(act.id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                  activityLevel === act.id
                    ? 'bg-brand-500/10 border-brand-500/50 text-brand-500'
                    : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{act.title}</div>
                  <div className="text-[11px] text-gray-400">{act.desc}</div>
                </div>
                {activityLevel === act.id && <Check className="w-4 h-4 text-brand-500" />}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Results Display */}
      {result && (
        <div className="lg:col-span-6 space-y-6">
          {/* Main Hero Target Card */}
          <div className="bg-gradient-to-br from-emerald-950 via-[#0d1722] to-[#0a0f18] p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="bg-emerald-500/20 text-brand-400 font-extrabold text-xs px-3 py-1 rounded-full border border-emerald-500/30">
                RECOMMENDED DAILY TARGET
              </span>
              <span className="text-xs text-gray-400 font-semibold">
                {result.proteinPerKg}g / kg bodyweight
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display text-6xl sm:text-7xl font-black text-white">
                {result.dailyProteinGoal}
              </span>
              <span className="text-2xl font-bold text-brand-500 font-display">grams/day</span>
            </div>

            {/* Min / Recommended / Max Range Bars */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex justify-between text-xs font-bold text-gray-300">
                <span>Minimum: {result.minRequirement}g</span>
                <span className="text-brand-400">Optimum: {result.dailyProteinGoal}g</span>
                <span>Max: {result.maxRecommendedRange}g</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-cyan-500" style={{ width: '30%' }} />
                <div className="h-full bg-brand-500 shadow-neon" style={{ width: '45%' }} />
                <div className="h-full bg-purple-500" style={{ width: '25%' }} />
              </div>
            </div>

            {/* Save Goal Button */}
            <button
              onClick={handleSaveToProfile}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-500 text-black font-black text-sm rounded-2xl hover:bg-brand-400 shadow-neon transition"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving to Profile...' : 'Save Goal to Fitness Profile'}</span>
            </button>
          </div>

          {/* Per-Meal Breakdown Table */}
          <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-4">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Suggested Per-Meal Distribution
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800">
                <div className="text-[11px] font-bold text-gray-400 uppercase">Breakfast</div>
                <div className="font-display text-lg font-black text-brand-500 mt-1">
                  {result.perMealBreakdown.breakfast}g
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800">
                <div className="text-[11px] font-bold text-gray-400 uppercase">Lunch</div>
                <div className="font-display text-lg font-black text-brand-500 mt-1">
                  {result.perMealBreakdown.lunch}g
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800">
                <div className="text-[11px] font-bold text-gray-400 uppercase">Post-Workout</div>
                <div className="font-display text-lg font-black text-brand-500 mt-1">
                  {result.perMealBreakdown.postWorkout}g
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800">
                <div className="text-[11px] font-bold text-gray-400 uppercase">Dinner</div>
                <div className="font-display text-lg font-black text-brand-500 mt-1">
                  {result.perMealBreakdown.dinner}g
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-[11px] font-bold text-gray-400 uppercase">Snack</div>
                <div className="font-display text-lg font-black text-brand-500 mt-1">
                  {result.perMealBreakdown.snack}g
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Supplement Stack for this goal */}
          <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-4">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-brand-500" />
              Recommended Stack For Your Goal
            </h4>

            <div className="space-y-2.5">
              {result.recommendations.map((rec: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-slate-900/70 border border-gray-100 dark:border-slate-800"
                >
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white">{rec.name}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{rec.reason}</div>
                  </div>
                  <Link
                    to="/products"
                    className="px-3 py-1.5 bg-gray-900 dark:bg-slate-800 hover:bg-brand-500 dark:hover:bg-brand-500 text-white hover:text-black dark:hover:text-black text-xs font-bold rounded-xl transition"
                  >
                    Explore →
                  </Link>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{result.disclaimer}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
