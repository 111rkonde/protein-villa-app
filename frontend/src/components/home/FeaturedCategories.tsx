import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';
import { ArrowRight, Dumbbell, TrendingUp, Zap, Activity, Heart, ShoppingBag, Package } from 'lucide-react';

export const FeaturedCategories: React.FC<{ categories: Category[] }> = ({ categories }) => {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Dumbbell':
        return <Dumbbell className="w-6 h-6 text-brand-500" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-amber-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-cyan-400" />;
      case 'Activity':
        return <Activity className="w-6 h-6 text-emerald-400" />;
      case 'Heart':
        return <Heart className="w-6 h-6 text-rose-400" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-6 h-6 text-purple-400" />;
      default:
        return <Package className="w-6 h-6 text-brand-500" />;
    }
  };

  return (
    <section className="py-16 bg-white dark:bg-[#0a0d12] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
              Browse Our Catalog
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1">
              Featured Categories
            </h2>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-500 hover:text-brand-400 transition"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group relative bg-gray-50 dark:bg-dark-surface rounded-3xl border border-gray-200/80 dark:border-slate-800/80 p-5 sm:p-6 overflow-hidden shadow-sm hover:shadow-2xl hover:border-brand-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Category Image Overlay */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-15 dark:opacity-20 group-hover:opacity-30 group-hover:scale-125 transition-all duration-500">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=300'}
                  alt={cat.name}
                  className="w-full h-full object-contain filter grayscale"
                />
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                {getIcon(cat.icon)}
              </div>

              {/* Content */}
              <div className="mt-8 space-y-1 z-10">
                <h3 className="font-display text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="pt-2 text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
