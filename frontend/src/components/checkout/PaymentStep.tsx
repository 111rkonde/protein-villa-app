import React, { useState } from 'react';
import {
  CreditCard,
  Banknote,
  QrCode,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

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
  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // UPI details state
  const [upiId, setUpiId] = useState('user@okhdfcbank');

  // Format Card Number (adds space every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2, 4)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // Fill Demo Card details
  const fillDemoCard = () => {
    setCardNumber('4532 8921 4402 9918');
    setCardName('ALEX JOHNSON');
    setCardExpiry('12/28');
    setCardCvv('786');
  };

  const handleProceed = () => {
    if (paymentMethod === 'CARD') {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        fillDemoCard(); // Autofill demo credentials if empty so user can seamlessly proceed
      }
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-brand-500" />
          <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
            Select Payment Method
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit Encrypted</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Card Payment Option */}
        <div
          className={`rounded-2xl border transition-all ${
            paymentMethod === 'CARD'
              ? 'bg-brand-500/5 border-brand-500/60 shadow-neon'
              : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-gray-300'
          }`}
        >
          <div
            onClick={() => setPaymentMethod('CARD')}
            className="flex items-start justify-between p-4 sm:p-5 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <span>Credit / Debit Card (Encrypted Gateway)</span>
                  <span className="text-[10px] font-extrabold bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded-full">
                    INSTANT
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Visa, MasterCard, RuPay, Amex with 3D Secure verification.
                </p>
              </div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-brand-500 flex items-center justify-center p-0.5">
              {paymentMethod === 'CARD' && <div className="w-full h-full bg-brand-500 rounded-full" />}
            </div>
          </div>

          {/* Interactive Card Form Dropdown */}
          {paymentMethod === 'CARD' && (
            <div className="px-5 pb-5 pt-2 border-t border-brand-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Enter Card Details
                </span>
                <button
                  type="button"
                  onClick={fillDemoCard}
                  className="flex items-center gap-1.5 text-xs font-bold text-brand-400 hover:text-brand-300 transition bg-brand-500/10 px-3 py-1 rounded-lg border border-brand-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1-Click Demo Card</span>
                </button>
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="4532 •••• •••• 9918"
                  className="w-full bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-mono p-3 rounded-xl border border-gray-200 dark:border-slate-700 tracking-wider font-bold"
                />
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  placeholder="e.g. ALEX JOHNSON"
                  className="w-full bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm p-3 rounded-xl border border-gray-200 dark:border-slate-700 font-bold uppercase"
                />
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    placeholder="12/28"
                    className="w-full bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-mono p-3 rounded-xl border border-gray-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                    CVV / CVC
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="•••"
                    className="w-full bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-mono p-3 rounded-xl border border-gray-200 dark:border-slate-700 font-bold tracking-widest"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* UPI Payment Option */}
        <div
          className={`rounded-2xl border transition-all ${
            paymentMethod === 'UPI'
              ? 'bg-brand-500/5 border-brand-500/60 shadow-neon'
              : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-gray-300'
          }`}
        >
          <div
            onClick={() => setPaymentMethod('UPI')}
            className="flex items-start justify-between p-4 sm:p-5 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <span>UPI / Instant QR Code</span>
                  <span className="text-[10px] font-extrabold bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
                    0% FEES
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Google Pay, PhonePe, Paytm, CRED, or scan QR code.
                </p>
              </div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-brand-500 flex items-center justify-center p-0.5">
              {paymentMethod === 'UPI' && <div className="w-full h-full bg-brand-500 rounded-full" />}
            </div>
          </div>

          {paymentMethod === 'UPI' && (
            <div className="px-5 pb-5 pt-2 border-t border-cyan-500/20 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                  Enter UPI ID / VPA
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value.toLowerCase())}
                  placeholder="e.g. mobile@upi or name@okhdfcbank"
                  className="w-full bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm p-3 rounded-xl border border-gray-200 dark:border-slate-700 font-bold"
                />
              </div>

              {/* UPI Quick Apps */}
              <div className="flex items-center gap-2 flex-wrap">
                {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'CRED'].map((app) => (
                  <span
                    key={app}
                    className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cash on Delivery Option */}
        <div
          className={`rounded-2xl border transition-all ${
            paymentMethod === 'COD'
              ? 'bg-brand-500/5 border-brand-500/60 shadow-neon'
              : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-gray-300'
          }`}
        >
          <div
            onClick={() => setPaymentMethod('COD')}
            className="flex items-start justify-between p-4 sm:p-5 cursor-pointer"
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
                  Pay safely with Cash or scan UPI QR upon delivery at your doorstep.
                </p>
              </div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-brand-500 flex items-center justify-center p-0.5">
              {paymentMethod === 'COD' && <div className="w-full h-full bg-brand-500 rounded-full" />}
            </div>
          </div>
        </div>
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
          onClick={handleProceed}
          className="flex items-center gap-2 px-8 py-3.5 bg-brand-500 text-black font-bold text-sm rounded-xl hover:bg-brand-400 shadow-neon transition"
        >
          <span>Review Order</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
