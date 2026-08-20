import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight, Trash2, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { CartItemCard } from './CartItemCard';
import { CouponInput } from './CouponInput';

export const CartDrawer: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const {
    isCartOpen,
    closeCart,
    items,
    itemCount,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    amountForFreeShipping,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    closeCart();
    if (!isAuthenticated) {
      showToast(
        'Please sign in or create a free athlete account to secure your order and tracking.',
        'auth',
        'Authentication Required'
      );
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  const freeShippingPercent = Math.min(100, Math.round(((999 - amountForFreeShipping) / 999) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-dark-surface shadow-2xl flex flex-col border-l border-gray-200 dark:border-slate-800 animate-slide-left">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-500" />
              <h3 className="font-display text-lg font-black text-gray-900 dark:text-white">
                Your Cart ({itemCount})
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="p-1.5 text-xs text-gray-400 hover:text-rose-500 rounded-lg transition flex items-center gap-1"
                  title="Empty Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={closeCart}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-emerald-500/10 dark:bg-emerald-950/40 p-3.5 border-b border-emerald-500/20 text-xs">
            {amountForFreeShipping > 0 ? (
              <div>
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                  <Truck className="w-4 h-4 text-emerald-500" />
                  <span>Add ₹{amountForFreeShipping.toLocaleString('en-IN')} more for FREE Delivery!</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-300 shadow-neon"
                    style={{ width: `${freeShippingPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>🎉 Congratulations! You unlocked FREE Express Shipping!</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length > 0 ? (
              items.map((item) => <CartItemCard key={item.id} item={item} />)
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800/80 flex items-center justify-center text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-gray-900 dark:text-white">Your Cart is Empty</h4>
                  <p className="text-xs text-gray-400">Fuel your fitness journey with our top whey protein formulas.</p>
                </div>
                <Link
                  to="/products"
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-xl bg-brand-500 text-black font-bold text-xs hover:bg-brand-400 shadow-neon transition"
                >
                  Explore Products
                </Link>
              </div>
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-dark-surface space-y-4">
              {/* Coupon input */}
              <CouponInput />

              {/* Calculation Summary */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-500 font-semibold">
                    <span>Discount Savings</span>
                    <span>- ₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Estimated Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-500">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Estimated GST (5%)</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-black text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-slate-800 font-display">
                  <span>Total Amount</span>
                  <span className="text-brand-500">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckoutClick}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-500 text-black font-bold text-sm hover:bg-brand-400 shadow-neon transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
