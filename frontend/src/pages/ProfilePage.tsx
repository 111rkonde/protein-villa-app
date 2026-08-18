import React, { useState } from 'react';
import { User, MapPin, Dumbbell, Flame, Save, LogOut, Shield, Package, Heart, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/auth.service';
import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [weight, setWeight] = useState(user?.weight?.toString() || '75');
  const [height, setHeight] = useState(user?.height?.toString() || '178');
  const [targetWeight, setTargetWeight] = useState(user?.targetWeight?.toString() || '80');
  const [fitnessGoal, setFitnessGoal] = useState(user?.fitnessGoal || 'Muscle Gain');
  const [activityLevel, setActivityLevel] = useState(user?.activityLevel || 'very_active');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">Please Log In</h2>
        <p className="text-gray-400 text-sm">Sign in to manage your fitness profile and addresses.</p>
        <Link to="/login" className="px-6 py-2.5 bg-brand-500 text-black font-bold text-xs rounded-xl">
          Sign In
        </Link>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await authService.updateProfile({
        name,
        phone,
        weight: weight ? Number(weight) : undefined,
        height: height ? Number(height) : undefined,
        targetWeight: targetWeight ? Number(targetWeight) : undefined,
        fitnessGoal,
        activityLevel,
      });
      await refreshUser();
      showToast('Profile updated successfully! ✨', 'success');
    } catch (error) {
      showToast('Failed to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-10 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Profile Banner */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-white text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-black font-black text-2xl flex items-center justify-center shadow-neon">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="font-display text-2xl font-black">{user.name}</h1>
                <span className="text-[10px] font-extrabold bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {user.role}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{user.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/my-orders"
              className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition"
            >
              <Package className="w-4 h-4" />
              <span>Orders</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Form Grid */}
        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Fitness Body Metrics */}
          <div className="lg:col-span-6 bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-slate-800">
              <Dumbbell className="w-5 h-5 text-brand-500" />
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                Fitness Profile & Body Metrics
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Current Weight (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Target Goal Weight (kg)
                </label>
                <input
                  type="number"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Primary Goal
                </label>
                <select
                  value={fitnessGoal}
                  onChange={(e) => setFitnessGoal(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm p-3 rounded-xl border border-gray-200 dark:border-slate-800 font-bold"
                >
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Lean Muscle">Lean Muscle</option>
                  <option value="Weight Loss">Fat Loss</option>
                  <option value="Weight Gain">Weight Bulk</option>
                  <option value="Athlete">Endurance / Athlete</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm p-3 rounded-xl border border-gray-200 dark:border-slate-800 font-bold"
              >
                <option value="sedentary">Sedentary (Desk Job)</option>
                <option value="light">Lightly Active (1-3 days/wk)</option>
                <option value="moderate">Moderately Active (3-5 days/wk)</option>
                <option value="very_active">Very Active (6-7 days/wk)</option>
                <option value="extra_active">Hardcore Athlete (2x sessions/day)</option>
              </select>
            </div>
          </div>

          {/* Right: Personal & Contact Information */}
          <div className="lg:col-span-6 bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-slate-800">
              <User className="w-5 h-5 text-brand-500" />
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                Personal Information
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full bg-gray-100 dark:bg-slate-800/60 text-gray-500 text-xs sm:text-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 cursor-not-allowed font-medium"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-500 text-black font-black text-sm rounded-2xl hover:bg-brand-400 shadow-neon transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
