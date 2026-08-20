import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Lock, Mail, Dumbbell, Shield, User, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage: React.FC = () => {
  const { login, user, isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const rawFrom = (location.state as any)?.from?.pathname || '/';
  const getDestination = (userRole?: string) => {
    if (userRole === 'ADMIN') {
      return rawFrom.startsWith('/admin') ? rawFrom : '/admin';
    }
    // Normal users must NEVER be routed to /admin paths
    return rawFrom.startsWith('/admin') ? '/' : rawFrom;
  };

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      navigate(getDestination(user.role), { replace: true });
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required to sign in.';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required to sign in.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fill out the highlighted required fields.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      // Navigation is handled cleanly by useEffect on authentication state update
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'USER' | 'ADMIN') => {
    setLoading(true);
    setErrors({});
    const demoEmail = role === 'ADMIN' ? 'owner@proteinvilla.demo' : 'user@proteinvilla.demo';
    const demoPass = role === 'ADMIN' ? 'Owner@12345' : 'User@12345';

    setEmail(demoEmail);
    setPassword(demoPass);

    try {
      await login(demoEmail, demoPass);
      // Navigation is handled cleanly by useEffect on authentication state update
    } catch (error: any) {
      showToast('Demo login error: ' + (error.response?.data?.message || 'Failed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in while page is rendering
  if (isAuthenticated && user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-dark-surface p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl text-center space-y-4 animate-scale-up">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl font-black text-gray-900 dark:text-white">
            Already Signed In
          </h2>
          <p className="text-xs text-gray-400">
            You are currently logged in as <strong className="text-white">{user.name}</strong> ({user.email}).
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => navigate(user.role === 'ADMIN' ? '/admin' : '/')}
              className="w-full py-3 bg-brand-500 text-black font-black text-xs rounded-xl hover:bg-brand-400 shadow-neon transition"
            >
              Go to {user.role === 'ADMIN' ? 'Admin Portal' : 'Store Home'}
            </button>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Standard Form with Professional Inline Validation */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="athlete@domain.com"
                className={`w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border transition ${
                  errors.email
                    ? 'border-rose-500 ring-1 ring-rose-500/30 bg-rose-500/5'
                    : 'border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500'
                }`}
              />
              <Mail className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ${errors.email ? 'text-rose-500' : 'text-gray-400'}`} />
            </div>
            {errors.email && (
              <div className="flex items-center gap-1.5 text-rose-500 text-xs font-semibold mt-1.5 animate-slide-up">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.email}</span>
              </div>
            )}
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
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••"
                className={`w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border transition ${
                  errors.password
                    ? 'border-rose-500 ring-1 ring-rose-500/30 bg-rose-500/5'
                    : 'border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500'
                }`}
              />
              <Lock className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ${errors.password ? 'text-rose-500' : 'text-gray-400'}`} />
            </div>
            {errors.password && (
              <div className="flex items-center gap-1.5 text-rose-500 text-xs font-semibold mt-1.5 animate-slide-up">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-500 text-black font-black text-sm rounded-2xl hover:bg-brand-400 shadow-neon transition disabled:opacity-50 active:scale-95"
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
