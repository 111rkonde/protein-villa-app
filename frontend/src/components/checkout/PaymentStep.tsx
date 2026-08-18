import React from 'react';
import { CreditCard, Banknote, QrCode, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

interface PaymentStepProps {
  paymentMethod: 'COD' | 'CARD' | 'UPI';
  setPaymentMethod: (method: 'COD' | 'CARD' | 'UPI') => void;
  onNext: () => void;
  onPrev: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  paymentMethod,
  setPaymentMethod,
  onNext,
  onPrev,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-slate-800">
        <CreditCard className="w-5 h-5 text-brand-500" />
        <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
          Select Payment Method
        </h3>
      </div>

      <div className="space-y-3">
        {/* Mock Card Payment */}
        <label
          onClick={() => setPaymentMethod('CARD')}
          className={`flex items-start justify-between p-4 sm:p-5 rounded-2xl border cursor-pointer transition ${
            paymentMethod === 'CARD'
              ? 'bg-brand-500/10 border-brand-500/60 shadow-neon'
              : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <span>Credit / Debit Card (Demo Gateway)</span>
                <span className="text-[10px] font-extrabold bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded-full">
                  INSTANT
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Visa, MasterCard, RuPay, American Express. Modular sandbox ready.
              </p>
            </div>
          </div>
          <div className="w-5 h-5 rounded-full border-2 border-brand-500 flex items-center justify-center p-0.5">
            {paymentMethod === 'CARD' && <div className="w-full h-full bg-brand-500 rounded-full" />}
          </div>
        </label>

        {/* Mock UPI */}
        <label
          onClick={() => setPaymentMethod('UPI')}
          className={`flex items-start justify-between p-4 sm:p-5 rounded-2xl border cursor-pointer transition ${
            paymentMethod === 'UPI'
              ? 'bg-brand-500/10 border-brand-500/60 shadow-neon'
              : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900 dark:text-white">
                UPI / QR Code (GPay, PhonePe, Paytm)
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Instant UPI auto-confirm with zero convenience charges.
              </p>
            </div>
          </div>
          <div className="w-5 h-5 rounded-full border-2 border-brand-500 flex items-center justify-center p-0.5">
            {paymentMethod === 'UPI' && <div className="w-full h-full bg-brand-500 rounded-full" />}
          </div>
        </label>

        {/* Cash on Delivery */}
        <label
          onClick={() => setPaymentMethod('COD')}
          className={`flex items-start justify-between p-4 sm:p-5 rounded-2xl border cursor-pointer transition ${
            paymentMethod === 'COD'
              ? 'bg-brand-500/10 border-brand-500/60 shadow-neon'
              : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900 dark:text-white">
                Cash on Delivery (COD)
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Pay safely in cash or scan UPI QR upon delivery at your doorstep.
              </p>
            </div>
          </div>
          <div className="w-5 h-5 rounded-full border-2 border-brand-500 flex items-center justify-center p-0.5">
            {paymentMethod === 'COD' && <div className="w-full h-full bg-brand-500 rounded-full" />}
          </div>
        </label>
      </div>

      <div className="flex items-center gap-2 p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold">
        <ShieldCheck className="w-4 h-4 text-brand-500" />
        <span>256-bit SSL Bank Grade Encryption. Your payment details are fully protected.</span>
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-3.5 bg-brand-500 text-black font-bold text-sm rounded-xl hover:bg-brand-400 shadow-neon transition"
        >
          <span>Review Order</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
