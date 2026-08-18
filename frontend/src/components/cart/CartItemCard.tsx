import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem } from '../../types';
import { useCart } from '../../context/CartContext';

export const CartItemCard: React.FC<{ item: CartItem }> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-slate-900/80 rounded-2xl border border-gray-200/80 dark:border-slate-800 transition">
      {/* Product Image */}
      <Link to={`/products/${item.productSlug || item.productId}`} className="shrink-0">
        <img
          src={item.productImage || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=120'}
          alt={item.productName}
          className="w-16 h-16 object-contain rounded-xl bg-white dark:bg-slate-800 p-1"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${item.productSlug || item.productId}`}
          className="block text-xs font-bold text-gray-900 dark:text-white truncate hover:text-brand-500 transition"
        >
          {item.productName}
        </Link>
        <div className="text-[11px] text-gray-400 mt-0.5">
          <span>{item.flavor}</span> • <span>{item.size}</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="text-xs font-black text-gray-900 dark:text-white font-display">
            ₹{item.price.toLocaleString('en-IN')}
          </div>

          {/* Quantity stepper */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-0.5">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1 rounded text-gray-400 hover:text-white transition"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-5 text-center text-xs font-bold text-gray-900 dark:text-white">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1 rounded text-gray-400 hover:text-white transition"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Remove Item */}
      <button
        onClick={() => removeItem(item.id)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition shrink-0"
        title="Remove"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
