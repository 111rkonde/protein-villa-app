import React from 'react';
import { Category, Brand } from '../../types';
import { Filter, RotateCcw, Check, Star } from 'lucide-react';

interface FilterSidebarProps {
  categories: Category[];
  brands: Brand[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  selectedGoal: string;
  setSelectedGoal: (goal: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  minRating: number;
  setMinRating: (val: number) => void;
  onReset: () => void;
}

export const ProductFilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  brands,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectedGoal,
  setSelectedGoal,
  priceRange,
  setPriceRange,
  inStockOnly,
  setInStockOnly,
  minRating,
  setMinRating,
  onReset,
}) => {
  const fitnessGoals = [
    { id: '', label: 'All Goals' },
    { id: 'Muscle Gain', label: 'Muscle Gain' },
    { id: 'Lean Muscle', label: 'Lean Muscle' },
    { id: 'Weight Gain', label: 'Weight Gain / Bulk' },
    { id: 'Weight Loss', label: 'Fat Loss & Shredding' },
    { id: 'Strength', label: 'Strength & Power' },
    { id: 'Athlete', label: 'Athlete Performance' },
  ];

  return (
    <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-2 font-display text-base font-bold text-gray-900 dark:text-white">
          <Filter className="w-4 h-4 text-brand-500" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-bold text-gray-400 hover:text-brand-500 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Fitness Goal */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Fitness Goal
        </h4>
        <div className="space-y-1.5">
          {fitnessGoals.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGoal(g.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                selectedGoal === g.id
                  ? 'bg-brand-500/10 text-brand-500 font-bold border border-brand-500/30'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>{g.label}</span>
              {selectedGoal === g.id && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Category
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
              selectedCategory === ''
                ? 'bg-brand-500/10 text-brand-500 font-bold border border-brand-500/30'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === '' && <Check className="w-3.5 h-3.5" />}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.slug)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                selectedCategory === c.slug
                  ? 'bg-brand-500/10 text-brand-500 font-bold border border-brand-500/30'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>{c.name}</span>
              {selectedCategory === c.slug && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Brand
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedBrand('')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
              selectedBrand === ''
                ? 'bg-brand-500/10 text-brand-500 font-bold border border-brand-500/30'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <span>All Brands</span>
            {selectedBrand === '' && <Check className="w-3.5 h-3.5" />}
          </button>
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBrand(b.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                selectedBrand === b.id
                  ? 'bg-brand-500/10 text-brand-500 font-bold border border-brand-500/30'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>{b.name}</span>
              {selectedBrand === b.id && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="uppercase tracking-wider text-gray-400">Max Price</span>
          <span className="text-brand-500 font-display">₹{priceRange[1].toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min={500}
          max={10000}
          step={200}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-brand-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>₹500</span>
          <span>₹10,000+</span>
        </div>
      </div>

      {/* In Stock & Ratings */}
      <div className="pt-2 space-y-3 border-t border-gray-100 dark:border-slate-800">
        <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-gray-700 dark:text-gray-300">
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500 accent-brand-500"
          />
        </label>

        <div>
          <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Minimum Rating
          </span>
          <div className="flex items-center gap-1.5">
            {[4, 4.5, 4.8].map((star) => (
              <button
                key={star}
                onClick={() => setMinRating(minRating === star ? 0 : star)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                  minRating === star
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-800'
                }`}
              >
                <span>{star}★+</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
