import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, X, ShoppingCart, Check, Star, ArrowRight, Plus } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';

export const ComparePage: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  if (compareList.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl font-black text-gray-900 dark:text-white">
          No Supplements in Comparison
        </h2>
        <p className="text-xs text-gray-400 max-w-sm">
          Browse supplements and click the compare icon on product cards to analyze protein content, macros, and price per serving side by side.
        </p>
        <Link
          to="/products"
          className="px-6 py-2.5 bg-brand-500 text-black font-bold text-xs rounded-xl hover:bg-brand-400 shadow-neon"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Nutritional & Value Analysis
            </span>
            <h1 className="font-display text-3xl font-black text-gray-900 dark:text-white mt-1">
              Compare Supplements ({compareList.length}/3)
            </h1>
          </div>

          <button
            onClick={clearCompare}
            className="text-xs font-bold text-rose-500 hover:underline"
          >
            Clear All Comparisons
          </button>
        </div>

        {/* Comparison Side-by-Side Table */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800">
                <th className="p-5 font-bold uppercase text-gray-400 w-48 bg-gray-50/50 dark:bg-slate-900/50">
                  Specification
                </th>
                {compareList.map((product) => (
                  <th key={product.id} className="p-5 min-w-[240px] align-top">
                    <div className="relative space-y-3">
                      <button
                        onClick={() => removeFromCompare(product.id)}
                        className="absolute -top-2 -right-2 p-1.5 rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                        title="Remove from compare"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-24 h-24 object-contain rounded-2xl bg-gray-50 dark:bg-slate-800 p-2 mx-auto"
                      />

                      <div className="text-center space-y-1">
                        <span className="text-[10px] uppercase font-bold text-brand-500">
                          {product.brand?.name}
                        </span>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2">
                          {product.name}
                        </h4>
                        <div className="font-display text-lg font-black text-gray-900 dark:text-white">
                          ₹{product.price.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          addToCart({
                            productId: product.id,
                            productName: product.name,
                            size: product.sizeOptions?.[0] || 'Standard',
                            flavor: product.flavorOptions?.[0] || 'Default',
                            quantity: 1,
                          })
                        }
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-brand-500 text-black font-black text-xs rounded-xl hover:bg-brand-400 shadow-neon transition"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {/* Protein per Serving */}
              <tr>
                <td className="p-4 font-bold text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-slate-900/50">
                  Protein Per Serving
                </td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-center font-display text-base font-black text-brand-500">
                    {p.nutritionInfo?.protein || 0}g
                  </td>
                ))}
              </tr>

              {/* Calories */}
              <tr>
                <td className="p-4 font-bold text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-slate-900/50">
                  Calories
                </td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-center font-bold text-orange-400">
                    {p.nutritionInfo?.calories || 0} kcal
                  </td>
                ))}
              </tr>

              {/* Carbs */}
              <tr>
                <td className="p-4 font-bold text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-slate-900/50">
                  Carbohydrates
                </td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-center text-gray-700 dark:text-gray-300">
                    {p.nutritionInfo?.carbs || 0}g
                  </td>
                ))}
              </tr>

              {/* Fat */}
              <tr>
                <td className="p-4 font-bold text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-slate-900/50">
                  Total Fat
                </td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-center text-gray-700 dark:text-gray-300">
                    {p.nutritionInfo?.fat || 0}g
                  </td>
                ))}
              </tr>

              {/* BCAAs */}
              <tr>
                <td className="p-4 font-bold text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-slate-900/50">
                  BCAAs / EAA Profile
                </td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-center text-cyan-400 font-bold">
                    {p.nutritionInfo?.bcaa || 'Full Spectrum'}
                  </td>
                ))}
              </tr>

              {/* Servings per Container */}
              <tr>
                <td className="p-4 font-bold text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-slate-900/50">
                  Total Servings
                </td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-center text-gray-900 dark:text-white font-bold">
                    {p.nutritionInfo?.servingsPerContainer || 30} Servings
                  </td>
                ))}
              </tr>

              {/* Price Per Serving */}
              <tr>
                <td className="p-4 font-bold text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-slate-900/50">
                  Price Per Single Serving
                </td>
                {compareList.map((p) => {
                  const servings = p.nutritionInfo?.servingsPerContainer || 30;
                  const perServing = Math.round(p.price / servings);
                  return (
                    <td key={p.id} className="p-4 text-center font-display text-sm font-black text-brand-500">
                      ₹{perServing} / scoop
                    </td>
                  );
                })}
              </tr>

              {/* Customer Rating */}
              <tr>
                <td className="p-4 font-bold text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-slate-900/50">
                  Customer Rating
                </td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{p.rating}</span>
                      <span className="text-gray-400 font-normal">({p.reviewCount})</span>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
