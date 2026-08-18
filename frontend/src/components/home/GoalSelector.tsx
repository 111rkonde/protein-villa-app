import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Flame, TrendingUp, Zap, Heart, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { productService } from '../../services/product.service';
import { ProductCard } from '../product/ProductCard';

export const GoalSelector: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<string>('Muscle Gain');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const goals = [
    {
      id: 'Muscle Gain',
      title: 'Build Muscle',
      subtitle: 'Whey Isolate & Creatine',
      icon: <Dumbbell className="w-5 h-5" />,
      color: 'from-emerald-500 to-teal-400',
    },
    {
      id: 'Weight Loss',
      title: 'Fat Loss & Shred',
      subtitle: 'Hydrolyzed & BCAAs',
      icon: <Flame className="w-5 h-5" />,
      color: 'from-rose-500 to-orange-400',
    },
    {
      id: 'Weight Gain',
      title: 'Mass & Bulking',
      subtitle: 'Dense Gainers & Peanut Butter',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-amber-500 to-yellow-400',
    },
    {
      id: 'Athlete',
      title: 'Explosive Performance',
      subtitle: 'High-Stim Pre-Workout',
      icon: <Zap className="w-5 h-5" />,
      color: 'from-cyan-500 to-blue-400',
    },
  ];

  useEffect(() => {
    const fetchGoalProducts = async () => {
      setLoading(true);
      try {
        const res = await productService.getProducts({ goal: selectedGoal, limit: 4 });
        setProducts(res.data || []);
      } catch (error) {
        console.error('Failed to load goal products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoalProducts();
  }, [selectedGoal]);

  return (
    <section className="py-16 bg-gray-50/60 dark:bg-[#070a0f] transition-colors border-y border-gray-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
            Tailored Nutrition Stacks
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            Shop by Your Fitness Goal
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Select your current training objective to discover scientifically formulated supplements designed to accelerate your results.
          </p>
        </div>

        {/* Goal Tabs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {goals.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGoal(g.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3.5 ${
                selectedGoal === g.id
                  ? 'bg-white dark:bg-dark-surface border-brand-500/80 shadow-neon scale-102'
                  : 'bg-white/60 dark:bg-slate-900/60 border-gray-200 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-900 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl bg-gradient-to-tr ${g.color} text-black shrink-0 shadow-sm`}
              >
                {g.icon}
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                  {g.title}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                  {g.subtitle}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Recommended Products for Selected Goal */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-gray-200 dark:bg-slate-800 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to={`/products?goal=${encodeURIComponent(selectedGoal)}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-xs hover:bg-brand-500 dark:hover:bg-brand-400 transition"
          >
            <span>View All {selectedGoal} Supplements</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
