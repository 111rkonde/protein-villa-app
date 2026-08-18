import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';

export const BestSellers: React.FC<{ products: Product[] }> = ({ products }) => {
  return (
    <section className="py-16 bg-white dark:bg-[#0a0d12] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-500">
              <Flame className="w-4 h-4 fill-current" />
              <span>Trending In India</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1">
              Best Selling Supplements
            </h2>
          </div>
          <Link
            to="/products?sort=popular"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-500 hover:text-brand-400 transition"
          >
            <span>Explore All Best Sellers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};
