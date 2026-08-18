import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Lock, Mail, Dumbbell, Shield, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email.trim(), password);
      showToast('Welcome back to Protein Villa! 🏋️', 'success');
      navigate(from, { replace: true });
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'USER' | 'ADMIN') => {
    setLoading(true);
    const demoEmail = role === 'ADMIN' ? 'owner@proteinvilla.demo' : 'user@proteinvilla.demo';
    const demoPass = role === 'ADMIN' ? 'Owner@12345' : 'User@12345';

    setEmail(demoEmail);
    setPassword(demoPass);

    try {
      await login(demoEmail, demoPass);
      showToast(`Signed in successfully as Demo ${role === 'ADMIN' ? 'Admin / Owner' : 'Athlete User'}! ⚡`, 'success');
      navigate(role === 'ADMIN' ? '/admin' : from, { replace: true });
    } catch (error: any) {
      showToast('Demo login error: ' + (error.response?.data?.message || 'Failed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-[#070a0f] transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-dark-surface p-8 sm:p-10 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl space-y-6 animate-scale-up">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-black flex items-center justify-center mx-auto shadow-neon">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Sign In to Protein Villa
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Access your orders, saved fitness goals, and daily protein tracker.
          </p>
        </div>

        {/* 1-Click Quick Demo Sign-in Box */}
        <div className="p-4 bg-emerald-500/10 dark:bg-emerald-950/40 rounded-2xl border border-emerald-500/30 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-brand-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Instant Demo Login:</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('USER')}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white dark:bg-slate-900 hover:bg-brand-500 dark:hover:bg-brand-500 text-gray-900 dark:text-white hover:text-black dark:hover:text-black font-bold text-xs rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm transition disabled:opacity-50"
            >
              <User className="w-3.5 h-3.5 text-brand-500" />
              <span>Demo User</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('ADMIN')}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white dark:bg-slate-900 hover:bg-brand-500 dark:hover:bg-brand-500 text-gray-900 dark:text-white hover:text-black dark:hover:text-black font-bold text-xs rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm transition disabled:opacity-50"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@domain.com"
                className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500"
              />
              <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5 text-xs font-bold">
              <span className="uppercase tracking-wider text-gray-400">Password</span>
              <Link to="/forgot-password" className="text-brand-500 hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500"
              />
              <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-500 text-black font-black text-sm rounded-2xl hover:bg-brand-400 shadow-neon transition disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Signing in...' : 'Sign In to Account'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-100 dark:border-slate-800">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-brand-500 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
