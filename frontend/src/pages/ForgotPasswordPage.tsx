import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, KeyRound, AlertCircle } from 'lucide-react';
import { authService } from '../services/auth.service';
import { useToast } from '../context/ToastContext';

export const ForgotPasswordPage: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please enter a valid email address.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      setSubmitted(true);
      showToast('Password reset instructions sent! 📧', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to request reset.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-[#070a0f] transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-dark-surface p-8 sm:p-10 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl space-y-6 animate-scale-up text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
          <KeyRound className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="font-display text-2xl font-black text-gray-900 dark:text-white">
            Reset Your Password
          </h2>
          <p className="text-xs text-gray-400">
            Enter your registered account email to receive reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="p-5 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-xs space-y-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6 text-brand-500 mx-auto" />
            <p className="font-bold">Check your inbox!</p>
            <p className="text-gray-400">We have dispatched secure recovery credentials to <strong>{email}</strong>.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
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
                    if (error) setError(null);
                  }}
                  placeholder="athlete@domain.com"
                  className={`w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border transition ${
                    error
                      ? 'border-rose-500 ring-1 ring-rose-500/30 bg-rose-500/5'
                      : 'border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500'
                  }`}
                />
                <Mail className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ${error ? 'text-rose-500' : 'text-gray-400'}`} />
              </div>
              {error && (
                <div className="flex items-center gap-1.5 text-rose-500 text-xs font-semibold mt-1.5 animate-slide-up">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-500 text-black font-black text-sm rounded-2xl hover:bg-brand-400 shadow-neon transition disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-brand-500 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
