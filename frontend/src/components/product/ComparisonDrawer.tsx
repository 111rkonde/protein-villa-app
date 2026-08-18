import React from 'react';
import { Link } from 'react-router-dom';
import { X, Scale, ArrowRight, Trash2 } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';

export const ComparisonDrawer: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, isCompareDrawerOpen, setIsCompareDrawerOpen } = useCompare();

  if (!isCompareDrawerOpen || compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-xl border-t-2 border-brand-500 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] p-4 sm:p-5 animate-slide-up">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Header Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
              Comparing Supplements ({compareList.length}/3)
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Analyze protein content, calories, and price per serving.
            </p>
          </div>
        </div>

        {/* Product Previews in Comparison */}
        <div className="flex items-center gap-3 overflow-x-auto py-1">
          {compareList.map((product) => (
            <div
              key={product.id}
              className="relative flex items-center gap-2 bg-gray-50 dark:bg-slate-900 p-2 pr-4 rounded-xl border border-gray-200 dark:border-slate-800 shrink-0"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-10 h-10 object-contain rounded-lg bg-white dark:bg-slate-800 p-1"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[130px]">
                  {product.name}
                </div>
                <div className="text-[11px] text-brand-500 font-semibold">
                  {product.nutritionInfo?.protein || 0}g Protein • ₹{product.price}
                </div>
              </div>
              <button
                onClick={() => removeFromCompare(product.id)}
                className="p-1 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 transition text-xs font-bold flex items-center gap-1"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <Link
            to="/compare"
            onClick={() => setIsCompareDrawerOpen(false)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-black font-bold text-xs sm:text-sm hover:bg-brand-400 shadow-neon transition"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setIsCompareDrawerOpen(false)}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
