import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle2, Plus, ShoppingCart, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { productService } from '../services/product.service';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const SupplementStackPage: React.FC = () => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [selectedGoal, setSelectedGoal] = useState<string>('Muscle Gain');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStackProducts = async () => {
      setLoading(true);
      try {
        const res = await productService.getProducts({ goal: selectedGoal, limit: 6 });
        const prods = res.data || [];
        setProducts(prods);
        setSelectedIds(prods.slice(0, 3).map((p: Product) => p.id));
      } catch (error) {
        console.error('Failed to load stack products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStackProducts();
  }, [selectedGoal]);

  const toggleItem = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 1) {
        showToast('A stack must contain at least 1 supplement.', 'warning');
        return;
      }
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const selectedProducts = products.filter((p) => selectedIds.includes(p.id));
  const rawSubtotal = selectedProducts.reduce((acc, p) => acc + p.price, 0);
  const bundleDiscount = Math.round(rawSubtotal * 0.18); // 18% Stack Bundle Discount
  const finalStackPrice = rawSubtotal - bundleDiscount;
  const costPerDay = Math.round(finalStackPrice / 30);

  const handleAddStackToCart = async () => {
    for (const item of selectedProducts) {
      await addToCart({
        productId: item.id,
        productName: item.name,
        size: item.sizeOptions?.[0] || 'Standard',
        flavor: item.flavorOptions?.[0] || 'Default',
        quantity: 1,
      });
    }
    showToast(`Added ${selectedProducts.length} stack items to your cart! 📦`, 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Interactive Bundle Builder</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">
            Custom Supplement Stack Builder
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Combine synergistically formulated supplements tailored for your training goals. Bundle and unlock 18% extra savings on your monthly regimen.
          </p>
        </div>

        {/* Goal Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {[
            { id: 'Muscle Gain', title: 'Muscle Hypertrophy', desc: 'Isolate + Creatine + Pre-Workout' },
            { id: 'Weight Loss', title: 'Lean Shred', desc: 'Hydrolyzed + BCAAs + Omega-3' },
            { id: 'Weight Gain', title: 'Caloric Surplus', desc: 'Monster Mass + Peanut Butter' },
            { id: 'Athlete', title: 'Peak Performance', desc: 'High-Stim Volt-X + 9-EAA' },
          ].map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGoal(g.id)}
              className={`p-4 rounded-2xl border text-left transition ${
                selectedGoal === g.id
                  ? 'bg-purple-500/10 border-purple-500/80 shadow-neon'
                  : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <div className="text-xs font-bold text-gray-900 dark:text-white">{g.title}</div>
              <div className="text-[11px] text-gray-400 truncate mt-0.5">{g.desc}</div>
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner message="Assembling custom stack formula..." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Stack Components Grid */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">
                Select Supplements to Include in Your Stack ({selectedIds.length} chosen)
              </h3>

              <div className="space-y-3">
                {products.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleItem(p.id)}
                      className={`flex items-center justify-between p-4 sm:p-5 rounded-3xl border cursor-pointer transition ${
                        isSelected
                          ? 'bg-white dark:bg-dark-surface border-brand-500/60 shadow-xl'
                          : 'bg-gray-50/50 dark:bg-slate-900/40 border-gray-200 dark:border-slate-800/80 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition ${
                            isSelected
                              ? 'bg-brand-500 border-brand-500 text-black'
                              : 'border-gray-400'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </div>

                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-16 h-16 object-contain rounded-xl bg-gray-50 dark:bg-slate-800 p-1"
                        />

                        <div>
                          <div className="text-xs font-extrabold uppercase text-brand-500">
                            {p.brand?.name}
                          </div>
                          <div className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                            {p.name}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {p.nutritionInfo?.protein || 0}g Protein • {p.flavorOptions?.[0] || 'Standard'}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-display text-lg font-black text-gray-900 dark:text-white">
                          ₹{p.price.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-emerald-500 font-bold">18% Bundle Discount</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stack Pricing Summary */}
            <div className="lg:col-span-4 bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl space-y-6 sticky top-28">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                  {selectedGoal} Stack Summary
                </span>
                <h3 className="font-display text-2xl font-black text-gray-900 dark:text-white mt-2">
                  Monthly Stack Investment
                </h3>
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Individual Items Price</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    ₹{rawSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-500 font-bold">
                  <span>Bundle Saving (18% OFF)</span>
                  <span>- ₹{bundleDiscount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Express Logistics</span>
                  <span className="text-emerald-500 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-black text-gray-900 dark:text-white pt-3 border-t border-gray-100 dark:border-slate-800 font-display">
                  <span>Bundle Total</span>
                  <span className="text-brand-500">₹{finalStackPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                ⚡ Only ₹{costPerDay}/day for your complete peak nutrition protocol!
              </div>

              <button
                onClick={handleAddStackToCart}
                className="w-full flex items-center justify-center gap-2 py-4 bg-brand-500 text-black font-black text-sm rounded-2xl hover:bg-brand-400 shadow-neon transition"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add Complete Stack to Cart</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
