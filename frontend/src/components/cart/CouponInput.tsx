import React, { useState } from 'react';
import { Tag, Check, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CouponInput: React.FC = () => {
  const { couponCode, applyCoupon, removeCoupon } = useCart();
  const [inputCode, setInputCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setIsApplying(true);
    try {
      await applyCoupon(inputCode.trim().toUpperCase());
      setInputCode('');
    } catch (error) {
      // Toast already shown in context
    } finally {
      setIsApplying(false);
    }
  };

  if (couponCode) {
    return (
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-600 dark:text-emerald-400">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>Coupon <strong>{couponCode}</strong> Applied!</span>
        </div>
        <button
          onClick={removeCoupon}
          className="p-1 rounded text-gray-400 hover:text-rose-500 transition"
          title="Remove Coupon"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value.toUpperCase())}
          placeholder="Promo code (e.g. WELCOME10)"
          className="w-full bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-xs pl-8 pr-3 py-2 rounded-xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 uppercase tracking-wider font-semibold"
        />
        <Tag className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
      </div>
      <button
        type="submit"
        disabled={isApplying || !inputCode.trim()}
        className="px-4 py-2 bg-gray-900 dark:bg-slate-800 hover:bg-brand-500 dark:hover:bg-brand-500 text-white dark:text-white hover:text-black dark:hover:text-black rounded-xl text-xs font-bold transition disabled:opacity-50"
      >
        {isApplying ? '...' : 'Apply'}
      </button>
    </form>
  );
};
