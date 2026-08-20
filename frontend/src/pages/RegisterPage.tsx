import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Phone, Dumbbell, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage: React.FC = () => {
  const { register, user, isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  // Auto redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};
    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fill out the highlighted fields.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });
      showToast('Welcome to Protein Villa! Account created successfully. 🎉', 'success');
      navigate('/');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

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
            You are signed in as <strong className="text-white">{user.name}</strong>.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-brand-500 text-black font-black text-xs rounded-xl hover:bg-brand-400 shadow-neon transition"
          >
            Go to Store Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-[#070a0f] transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-dark-surface p-8 sm:p-10 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl space-y-6 animate-scale-up">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-black flex items-center justify-center mx-auto shadow-neon">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Join the community of verified athletes and unlock personalized nutrition tracking.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="Alex Johnson"
                className={`w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border transition ${
                  errors.name
                    ? 'border-rose-500 ring-1 ring-rose-500/30 bg-rose-500/5'
                    : 'border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500'
                }`}
              />
              <User className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ${errors.name ? 'text-rose-500' : 'text-gray-400'}`} />
            </div>
            {errors.name && (
              <div className="flex items-center gap-1.5 text-rose-500 text-xs font-semibold mt-1.5 animate-slide-up">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Email Address *
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
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500"
              />
              <Phone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Password (Min 6 characters) *
            </label>
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
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Sign Up Free'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-100 dark:border-slate-800">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-500 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
