import React from 'react';
import { Truck, Zap, Shield, ArrowRight, ArrowLeft } from 'lucide-react';

interface DeliveryStepProps {
  deliveryMethod: string;
  setDeliveryMethod: (method: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const DeliveryStep: React.FC<DeliveryStepProps> = ({
  deliveryMethod,
  setDeliveryMethod,
  onNext,
  onPrev,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-slate-800">
        <Truck className="w-5 h-5 text-brand-500" />
        <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
          Choose Delivery Method
        </h3>
      </div>

      <div className="space-y-3">
        {/* Standard Logistics */}
        <label
          onClick={() => setDeliveryMethod('standard')}
          className={`flex items-start justify-between p-4 sm:p-5 rounded-2xl border cursor-pointer transition ${
            deliveryMethod === 'standard'
              ? 'bg-brand-500/10 border-brand-500/60 shadow-neon'
              : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-brand-500 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <span>Standard Insured Courier</span>
                <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                  POPULAR
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Estimated Delivery in 2 - 4 Business Days with BlueDart / Delhivery.
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-brand-500 font-display">FREE</div>
            <div className="text-[10px] text-gray-400">On ₹999+</div>
          </div>
        </label>

        {/* Priority Super Express */}
        <label
          onClick={() => setDeliveryMethod('express')}
          className={`flex items-start justify-between p-4 sm:p-5 rounded-2xl border cursor-pointer transition ${
            deliveryMethod === 'express'
              ? 'bg-brand-500/10 border-brand-500/60 shadow-neon'
              : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900 dark:text-white">
                Priority Air Express (Next Day Metro)
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Guaranteed expedited packing with priority dispatch within 6 hours.
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-gray-900 dark:text-white font-display">₹99</div>
            <div className="text-[10px] text-gray-400">Air Express</div>
          </div>
        </label>
      </div>

      <div className="bg-gray-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 flex items-center gap-3 text-xs text-gray-500">
        <Shield className="w-5 h-5 text-brand-500 shrink-0" />
        <span>All shipments are packed in tamper-proof bubble-lined heavy boxing with hologram seals.</span>
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
          <span>Continue to Payment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
