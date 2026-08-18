import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, X } from 'lucide-react';
import { adminService } from '../services/admin.service';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AdminCouponsPage: React.FC = () => {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('15');
  const [minOrderAmount, setMinOrderAmount] = useState('999');
  const [maxDiscount, setMaxDiscount] = useState('500');

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCoupons();
      setCoupons(data);
    } catch (error) {
      console.error('Failed to load coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createCoupon({
        code: code.trim().toUpperCase(),
        discountPercent: Number(discountPercent),
        minOrderAmount: Number(minOrderAmount),
        maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
        isActive: true,
      });
      showToast(`Coupon ${code} created! 🏷️`, 'success');
      setIsModalOpen(false);
      setCode('');
      await fetchCoupons();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to create coupon.', 'error');
    }
  };

  const handleDeleteCoupon = async (id: string, couponCode: string) => {
    if (confirm(`Delete coupon ${couponCode}?`)) {
      try {
        await adminService.deleteCoupon(id);
        showToast(`Coupon ${couponCode} deleted.`, 'info');
        await fetchCoupons();
      } catch (error) {
        showToast('Failed to delete coupon.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
              Promotions & Campaigns
            </span>
            <h1 className="font-display text-3xl font-black text-gray-900 dark:text-white mt-1">
              Coupon Codes Management
            </h1>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-brand-500 text-black font-black text-xs sm:text-sm rounded-2xl hover:bg-brand-400 shadow-neon transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Promo Coupon</span>
          </button>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading active coupons..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-black text-brand-500 bg-brand-500/10 px-3 py-1 rounded-xl border border-brand-500/30">
                    {c.code}
                  </span>
                  <button
                    onClick={() => handleDeleteCoupon(c.id, c.code)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl font-black font-display text-gray-900 dark:text-white">
                    {c.discountPercent}% OFF
                  </div>
                  <div className="text-xs text-gray-400">
                    Min Order: <strong>₹{c.minOrderAmount || 0}</strong>
                    {c.maxDiscount && <span> • Max Cap: ₹{c.maxDiscount}</span>}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center text-[11px] text-gray-400">
                  <span>Used {c.usedCount || 0} times</span>
                  <span className="text-emerald-500 font-bold">✓ Active</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Discount Coupon">
          <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                Coupon Promo Code *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER25"
                className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border border-gray-200 dark:border-slate-800 font-mono font-bold uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Discount % *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={90}
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border border-gray-200 dark:border-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Min Order (₹)
                </label>
                <input
                  type="number"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border border-gray-200 dark:border-slate-800 font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-brand-500 text-black font-black rounded-xl hover:bg-brand-400 shadow-neon transition"
              >
                Create Coupon
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
