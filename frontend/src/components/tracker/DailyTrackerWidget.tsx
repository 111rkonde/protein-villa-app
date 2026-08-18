import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Flame, Plus, Trash2, Trophy, Award, Zap, CheckCircle, Calendar, Sparkles, LogIn } from 'lucide-react';
import { DailyTrackerData, ProteinLog } from '../../types';
import { trackerService } from '../../services/tracker.service';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LogMealModal } from './LogMealModal';

export const DailyTrackerWidget: React.FC = () => {
  const { isAuthenticated, loginAsDemoUser } = useAuth();
  const { showToast } = useToast();

  const [trackerData, setTrackerData] = useState<DailyTrackerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [demoLoggingIn, setDemoLoggingIn] = useState<boolean>(false);

  const fetchTracker = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    try {
      const data = await trackerService.getDailyTracker();
      setTrackerData(data);

      // Trigger confetti if goal achieved today
      if (data.percentage >= 100) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (error) {
      console.error('Failed to load tracker:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchTracker();
  }, [fetchTracker]);

  const handleDeleteLog = async (logId: string) => {
    try {
      await trackerService.deleteLog(logId);
      await fetchTracker();
      showToast('Log entry removed.', 'info');
    } catch (error) {
      showToast('Failed to remove log.', 'error');
    }
  };

  const handleQuickAdd = async (foodName: string, grams: number, mealType: string) => {
    try {
      await trackerService.logProtein({
        mealType,
        foodName,
        proteinGrams: grams,
      });
      await fetchTracker();
      showToast(`Logged +${grams}g from ${foodName}! ⚡`, 'success');
    } catch (error) {
      showToast('Could not log protein.', 'error');
    }
  };

  const handleDemoSignIn = async () => {
    setDemoLoggingIn(true);
    try {
      await loginAsDemoUser();
      showToast('Signed in as Demo Athlete! 🎉', 'success');
    } catch (error) {
      showToast('Failed to sign in as demo user', 'error');
    } finally {
      setDemoLoggingIn(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white dark:bg-dark-surface p-8 sm:p-12 rounded-3xl border border-gray-200 dark:border-slate-800 text-center shadow-xl space-y-6 max-w-2xl mx-auto">
        <div className="w-20 h-20 rounded-3xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto shadow-inner">
          <Flame className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
            Daily Protein & Consistency Tracker
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Log your shakes, monitor your circular target ring, build unbroken consistency streaks, and unlock achievement badges.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-brand-500 text-black font-bold text-sm hover:bg-brand-400 transition shadow-neon flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Your Account</span>
          </Link>
          <button
            onClick={handleDemoSignIn}
            disabled={demoLoggingIn}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white font-bold text-sm hover:bg-gray-200 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2 border border-gray-200 dark:border-slate-700"
          >
            <Zap className="w-4 h-4 text-brand-500" />
            <span>{demoLoggingIn ? 'Signing In...' : '1-Click Demo Login'}</span>
          </button>
        </div>
      </div>
    );
  }

  if (loading || !trackerData) {
    return (
      <div className="p-8 text-center text-gray-400 animate-pulse">
        Loading protein tracker dashboard...
      </div>
    );
  }

  const { targetGrams, totalConsumed, remaining, percentage, logs, weeklyProgress, currentStreak, achievements } = trackerData;

  return (
    <div className="space-y-8">
      {/* Top Banner & Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-gradient-to-br from-emerald-950/80 via-[#0d1622] to-[#080d15] p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl">
        {/* Left Circular Visual Progress Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Circular Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-brand-500 transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * Math.min(100, percentage)) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Center Text */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-display text-4xl font-black text-white">{percentage}%</span>
              <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider">
                {totalConsumed}g / {targetGrams}g
              </span>
            </div>
          </div>
        </div>

        {/* Right Info & Quick Action */}
        <div className="md:col-span-8 space-y-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-brand-400 bg-brand-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                TODAY'S PROTEIN TARGET
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                {remaining === 0 ? '🏆 Daily Goal Completed!' : `${remaining}g Remaining Today`}
              </h3>
            </div>

            {/* Streak Badge */}
            <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 px-4 py-2 rounded-2xl">
              <Flame className="w-6 h-6 text-orange-500 animate-bounce" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-orange-300 font-bold">Current Streak</div>
                <div className="text-base font-black text-white font-display">{currentStreak} Days Active</div>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-400">
            Keep hitting your recommended target to optimize muscle protein synthesis and maximize gym performance.
          </p>

          <div className="flex flex-wrap gap-3 justify-center sm:justify-start pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 text-black font-black text-xs sm:text-sm hover:bg-brand-400 shadow-neon transition"
            >
              <Plus className="w-4 h-4" />
              <span>Log Meal / Shake</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Add Supplement Shortcuts */}
      <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-4">
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Quick 1-Click Supplement Presets
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => handleQuickAdd('PV ISO-Gold 1 Scoop', 28, 'Post-Workout')}
            className="p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 hover:border-brand-500 text-left transition group"
          >
            <div className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-brand-500">
              1 Scoop Whey Isolate
            </div>
            <div className="text-sm font-black text-brand-500 font-display mt-0.5">+28g Protein</div>
          </button>

          <button
            onClick={() => handleQuickAdd('High Protein Peanut Butter (2 Tbsp)', 10, 'Snack')}
            className="p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 hover:border-brand-500 text-left transition group"
          >
            <div className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-brand-500">
              Peanut Butter (2 Tbsp)
            </div>
            <div className="text-sm font-black text-brand-500 font-display mt-0.5">+10g Protein</div>
          </button>

          <button
            onClick={() => handleQuickAdd('PV Crunch Bar (1 Bar)', 20, 'Snack')}
            className="p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 hover:border-brand-500 text-left transition group"
          >
            <div className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-brand-500">
              PV Crunch Protein Bar
            </div>
            <div className="text-sm font-black text-brand-500 font-display mt-0.5">+20g Protein</div>
          </button>

          <button
            onClick={() => handleQuickAdd('4 Boiled Whole Eggs', 24, 'Breakfast')}
            className="p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 hover:border-brand-500 text-left transition group"
          >
            <div className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-brand-500">
              4 Boiled Eggs
            </div>
            <div className="text-sm font-black text-brand-500 font-display mt-0.5">+24g Protein</div>
          </button>
        </div>
      </div>

      {/* Weekly Progress & Today's Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Consistency Progress Bar Graph */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
            <h4 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>Past 7-Day Consistency</span>
            </h4>
            <span className="text-xs text-gray-400">Target: {targetGrams}g/day</span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-4 items-end h-44">
            {weeklyProgress.map((day, i) => {
              const heightPercent = Math.min(100, Math.round((day.consumed / targetGrams) * 100));
              return (
                <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-bold text-gray-400">{day.consumed}g</span>
                  <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-xl h-28 flex items-end p-1 overflow-hidden">
                    <div
                      className={`w-full rounded-lg transition-all duration-500 ${
                        day.achieved ? 'bg-brand-500 shadow-neon' : 'bg-slate-500/40'
                      }`}
                      style={{ height: `${heightPercent || 5}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase">{day.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unlocked Fitness Badges */}
        <div className="lg:col-span-5 bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-4">
          <h4 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-slate-800">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Achievements & Badges</span>
          </h4>

          <div className="space-y-3">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition ${
                  ach.unlocked
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-500'
                    : 'bg-gray-50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800 text-gray-400 opacity-60'
                }`}
              >
                <div className="text-2xl">{ach.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <span>{ach.title}</span>
                    {ach.unlocked && <CheckCircle className="w-3.5 h-3.5 text-amber-500" />}
                  </div>
                  <div className="text-[11px] text-gray-400 truncate">{ach.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Logged Items List */}
      <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-4">
        <h4 className="font-bold text-base text-gray-900 dark:text-white flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
          <span>Today's Logged Nutrition ({logs.length} entries)</span>
          <span className="text-xs font-bold text-brand-500">Total: {totalConsumed}g Protein</span>
        </h4>

        {logs.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {logs.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white">
                    {item.foodName}
                  </div>
                  <div className="text-[11px] text-gray-400">
                    <span className="text-brand-500 font-semibold">{item.mealType}</span>
                    {item.calories && <span> • {item.calories} kcal</span>}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-gray-900 dark:text-white font-display">
                    +{item.proteinGrams}g
                  </span>
                  <button
                    onClick={() => handleDeleteLog(item.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 transition"
                    title="Delete log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 text-xs">
            No meals logged for today yet. Click "Log Meal / Shake" above to start tracking!
          </div>
        )}
      </div>

      {/* Modal Dialog for Manual Log */}
      <LogMealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTracker}
      />
    </div>
  );
};
