import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
    });
  }, []);

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-gray-50/50 dark:bg-[#070a0f] transition-colors">
      <div className="max-w-lg w-full bg-white dark:bg-dark-surface p-8 sm:p-10 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl text-center space-y-6 animate-scale-up">
        {/* Big Success Check */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 text-brand-500 flex items-center justify-center mx-auto shadow-neon">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-500 bg-brand-500/10 px-3 py-1 rounded-full">
            Order Confirmed & Verified
          </span>
          <h1 className="font-display text-3xl font-black text-gray-900 dark:text-white">
            Thank You For Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            We have received your supplement order and our warehouse is scheduling immediate HPLC purity-verified packing.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 text-xs space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-gray-400">Order ID:</span>
            <span className="font-bold text-gray-900 dark:text-white font-mono">{id || 'PV-2026-CONFIRMED'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Estimated Dispatch:</span>
            <span className="font-bold text-emerald-500">Within 6 Hours (Air Express)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Authenticity Guarantee:</span>
            <span className="font-bold text-gray-900 dark:text-white">✓ 100% Genuine Certified</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {id && (
            <Link
              to={`/orders/${id}`}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-500 text-black font-black text-sm rounded-2xl hover:bg-brand-400 shadow-neon transition"
            >
              <Truck className="w-4 h-4" />
              <span>Track Order Live Timeline</span>
            </Link>
          )}

          <Link
            to="/products"
            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-2xl hover:bg-gray-200 dark:hover:bg-slate-700 transition"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
