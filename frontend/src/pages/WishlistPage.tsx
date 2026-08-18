import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/product/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, itemCount } = useWishlist();
  const { addToCart } = useCart();

  const handleAddAllToCart = async () => {
    for (const item of wishlist) {
      await addToCart({
        productId: item.product.id,
        productName: item.product.name,
        size: item.product.sizeOptions?.[0] || 'Standard',
        flavor: item.product.flavorOptions?.[0] || 'Default',
        quantity: 1,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
              Saved Supplements
            </span>
            <h1 className="font-display text-3xl font-black text-gray-900 dark:text-white mt-1">
              My Wishlist ({itemCount})
            </h1>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={handleAddAllToCart}
              className="flex items-center gap-2 px-6 py-3 bg-brand-500 text-black font-bold text-xs sm:text-sm rounded-2xl hover:bg-brand-400 shadow-neon transition"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add All to Cart</span>
            </button>
          )}
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <ProductCard key={item.id} product={item.product} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-surface p-12 rounded-3xl border border-gray-200 dark:border-slate-800 text-center space-y-4 shadow-xl max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
              Your Wishlist is Empty
            </h3>
            <p className="text-xs text-gray-400">
              Save your favorite proteins, gainers, and pre-workouts to buy later or compare specs.
            </p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-brand-500 text-black font-bold text-xs rounded-xl hover:bg-brand-400 shadow-neon"
            >
              Explore Catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
