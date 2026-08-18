import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Box, Scale, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, isLoading } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();

  const isLiked = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const finalPrice = product.discountPercent > 0
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : product.price;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart({
      productId: product.id,
      productName: product.name,
      size: product.sizeOptions?.[0] || 'Standard',
      flavor: product.flavorOptions?.[0] || 'Default',
      quantity: 1,
    });
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id, product.name);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(product);
  };

  return (
    <div className="group relative bg-white dark:bg-dark-surface rounded-2xl border border-gray-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-2xl hover:border-brand-500/50 transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Section */}
      <div className="relative w-full pt-[100%] bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-[#0d131f] dark:to-[#080b10] overflow-hidden p-6">
        <Link to={`/products/${product.slug || product.id}`} className="absolute inset-0 flex items-center justify-center p-6">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600'}
            alt={product.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain transform group-hover:scale-108 transition-transform duration-300 drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)]"
          />
        </Link>

        {/* Badges Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discountPercent > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-md uppercase tracking-wider">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-md shadow-md uppercase tracking-wider">
              BEST SELLER
            </span>
          )}
          {product.isFeatured && !product.isBestSeller && (
            <span className="bg-brand-500 text-black text-[10px] font-black px-2 py-0.5 rounded-md shadow-md uppercase tracking-wider">
              FEATURED
            </span>
          )}
        </div>

        {/* Action Buttons Top Right */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {/* Wishlist button */}
          <button
            onClick={handleWishlistClick}
            className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
              isLiked
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 dark:bg-slate-900/80 text-gray-700 dark:text-gray-300 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          {/* Compare button */}
          <button
            onClick={handleCompareClick}
            className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
              isCompared
                ? 'bg-purple-500 text-white'
                : 'bg-white/80 dark:bg-slate-900/80 text-gray-700 dark:text-gray-300 hover:text-purple-400 hover:bg-white dark:hover:bg-slate-800'
            }`}
            title="Compare Product"
            aria-label="Compare"
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* 3D Available Badge (Bottom Image) */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md border border-slate-700/60 px-2 py-1 rounded-lg text-[10px] font-bold text-brand-400 flex items-center gap-1">
          <Box className="w-3 h-3" />
          <span>3D View</span>
        </div>
      </div>

      {/* Product Details Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">
            <span className="text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider">
              {product.brand?.name}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-gray-900 dark:text-white text-xs">{product.rating}</span>
              <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link
            to={`/products/${product.slug || product.id}`}
            className="block font-bold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-2 hover:text-brand-500 transition"
          >
            {product.name}
          </Link>

          {/* Nutrition highlights chip */}
          {product.nutritionInfo?.protein !== undefined && (
            <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-semibold">
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-brand-400 px-2 py-0.5 rounded-md border border-emerald-500/20">
                {product.nutritionInfo.protein}g Protein
              </span>
              {product.nutritionInfo.bcaa && (
                <span className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded-md border border-cyan-500/20">
                  {product.nutritionInfo.bcaa} BCAAs
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-2 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black text-gray-900 dark:text-white font-display">
                ₹{finalPrice.toLocaleString('en-IN')}
              </span>
              {product.discountPercent > 0 && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              {product.stockQuantity > 0 ? '✓ In Stock' : 'Out of Stock'}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={product.stockQuantity <= 0}
            className={`p-3 rounded-xl flex items-center justify-center transition-all ${
              product.stockQuantity <= 0
                ? 'bg-gray-200 dark:bg-slate-800 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 dark:bg-brand-500 text-white dark:text-black hover:bg-brand-500 dark:hover:bg-brand-400 hover:shadow-neon font-bold'
            }`}
            aria-label="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
