import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CartItemCard } from '../components/cart/CartItemCard';
import { CouponInput } from '../components/cart/CouponInput';

export const CartPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const {
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

  const handleProceedToCheckout = () => {
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

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-display text-2xl font-black text-gray-900 dark:text-white">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-sm">
          Discover 100% authentic Whey Protein, Creatine, and Gains formulas to power your training.
        </p>
        <Link
          to="/products"
          className="px-8 py-3.5 bg-brand-500 text-black font-black text-xs sm:text-sm rounded-2xl hover:bg-brand-400 shadow-neon transition"
        >
          Explore Supplements
        </Link>
      </div>
    );
  }

  const freeShippingPercent = Math.min(100, Math.round(((999 - amountForFreeShipping) / 999) * 100));

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-black text-gray-900 dark:text-white">
              Shopping Cart ({itemCount} items)
            </h1>
            <p className="text-xs text-gray-400">Review your supplements before checkout.</p>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:underline"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free shipping banner */}
            <div className="bg-emerald-500/10 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/20 text-xs">
              {amountForFreeShipping > 0 ? (
                <div>
                  <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                    <Truck className="w-4 h-4" />
                    <span>Add ₹{amountForFreeShipping.toLocaleString('en-IN')} more to unlock FREE Delivery!</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all duration-300 shadow-neon"
                      style={{ width: `${freeShippingPercent}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-500 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>🎉 FREE Shipping Unlocked on this order!</span>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-4">
              {items.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link
                to="/products"
                className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brand-500"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-4 bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-6 sticky top-28">
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-slate-800">
              Order Summary
            </h3>

            <CouponInput />

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-500 font-semibold">
                  <span>Coupon Discount</span>
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
              <div className="flex justify-between text-lg font-black text-gray-900 dark:text-white pt-3 border-t border-gray-100 dark:border-slate-800 font-display">
                <span>Total Amount</span>
                <span className="text-brand-500">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full flex items-center justify-center gap-2 py-4 bg-brand-500 text-black font-black text-sm rounded-2xl hover:bg-brand-400 shadow-neon transition"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
