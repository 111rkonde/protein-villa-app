import React from 'react';
import { Address, CartItem } from '../../types';
import { CheckCircle, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';

interface ReviewStepProps {
  address: Address;
  deliveryMethod: string;
  paymentMethod: 'COD' | 'CARD' | 'UPI';
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  couponCode: string | null;
  onPlaceOrder: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  address,
  deliveryMethod,
  paymentMethod,
  items,
  subtotal,
  discount,
  shippingFee,
  tax,
  total,
  couponCode,
  onPlaceOrder,
  onPrev,
  isSubmitting,
}) => {
  const deliveryCost = deliveryMethod === 'express' ? 99 : shippingFee;
  const finalTotal = total + (deliveryMethod === 'express' && shippingFee === 0 ? 99 : 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-slate-800">
        <CheckCircle className="w-5 h-5 text-brand-500" />
        <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
          Review & Confirm Your Order
        </h3>
      </div>

      {/* Order Item List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Items Ordered ({items.length})
        </h4>
        <div className="bg-gray-50 dark:bg-slate-900/60 rounded-2xl p-4 divide-y divide-gray-100 dark:divide-slate-800 max-h-56 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-12 h-12 object-contain rounded-lg bg-white dark:bg-slate-800 p-1"
                />
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white max-w-[200px] sm:max-w-xs truncate">
                    {item.productName}
                  </div>
                  <div className="text-[11px] text-gray-400">
                    {item.flavor} • {item.size} • Qty: {item.quantity}
                  </div>
                </div>
              </div>
              <div className="text-xs font-black text-gray-900 dark:text-white font-display">
                ₹{item.totalPrice.toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping and Payment Recap Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="bg-gray-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-1">
          <div className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px] text-brand-500">
            Delivery To:
          </div>
          <div className="font-bold text-sm text-gray-900 dark:text-white">{address.fullName}</div>
          <div className="text-gray-400">{address.street}</div>
          <div className="text-gray-400">
            {address.city}, {address.state} - {address.postalCode}
          </div>
          <div className="text-gray-400 font-semibold">{address.phone}</div>
        </div>

        <div className="bg-gray-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-1">
          <div className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px] text-brand-500">
            Payment & Method:
          </div>
          <div className="font-bold text-sm text-gray-900 dark:text-white">
            {paymentMethod === 'COD' && 'Cash on Delivery (COD)'}
            {paymentMethod === 'CARD' && 'Demo Card Payment'}
            {paymentMethod === 'UPI' && 'UPI / QR Code Transfer'}
          </div>
          <div className="text-gray-400">
            Logistics: {deliveryMethod === 'express' ? 'Priority Air Express' : 'Standard Insured Courier'}
          </div>
          {couponCode && (
            <div className="text-emerald-500 font-bold">
              Coupon Applied: {couponCode} (-₹{discount.toLocaleString('en-IN')})
            </div>
          )}
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="bg-gray-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-2 text-xs">
        <div className="flex justify-between text-gray-500 dark:text-gray-400">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            ₹{subtotal.toLocaleString('en-IN')}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-500 font-semibold">
            <span>Discount</span>
            <span>- ₹{discount.toLocaleString('en-IN')}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-500 dark:text-gray-400">
          <span>Delivery Fee</span>
          <span>{deliveryCost === 0 ? <strong className="text-emerald-500">FREE</strong> : `₹${deliveryCost}`}</span>
        </div>
        <div className="flex justify-between text-gray-500 dark:text-gray-400">
          <span>GST (5%)</span>
          <span>₹{tax.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-base font-black text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-slate-800 font-display">
          <span>Final Total</span>
          <span className="text-brand-500">₹{finalTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-10 py-4 bg-brand-500 text-black font-black text-sm rounded-2xl hover:bg-brand-400 shadow-neon transition disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing Order...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              <span>Place Order (₹{finalTotal.toLocaleString('en-IN')})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
