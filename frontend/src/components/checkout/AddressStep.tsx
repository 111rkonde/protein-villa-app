import React, { useState } from 'react';
import { Address } from '../../types';
import { MapPin, Phone, User as UserIcon, Building, ArrowRight, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface AddressStepProps {
  address: Address;
  setAddress: React.Dispatch<React.SetStateAction<Address>>;
  onNext: () => void;
}

export const AddressStep: React.FC<AddressStepProps> = ({ address, setAddress, onNext }) => {
  const { showToast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const fillDemoAddress = () => {
    setAddress({
      id: address.id || '',
      userId: address.userId || '',
      fullName: 'Alex Johnson',
      phone: '+91 98765 43210',
      street: '402 Titanium Heights, MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
      isDefault: true,
    });
    setErrors({});
    showToast('Demo shipping address loaded! 📍', 'info');
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!address.fullName?.trim()) errs.fullName = 'Full Name is required.';
    if (!address.phone?.trim()) errs.phone = 'Phone number is required.';
    if (!address.street?.trim()) errs.street = 'Street address is required.';
    if (!address.city?.trim()) errs.city = 'City is required.';
    if (!address.state?.trim()) errs.state = 'State is required.';
    if (!address.postalCode?.trim()) {
      errs.postalCode = 'Postal / PIN code is required.';
    } else if (!/^[0-9]{6}$/.test(address.postalCode.trim())) {
      errs.postalCode = 'Please enter a valid 6-digit PIN code (e.g. 560001).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please correct the highlighted address fields before proceeding.', 'warning', 'Address Incomplete');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-500" />
          <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
            Shipping Address
          </h3>
        </div>
        <button
          type="button"
          onClick={fillDemoAddress}
          className="text-xs font-bold text-brand-500 hover:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20 transition flex items-center gap-1"
        >
          <span>✨ Auto-Fill Demo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Full Name *
          </label>
          <div className="relative">
            <input
              type="text"
              name="fullName"
              value={address.fullName}
              onChange={handleChange}
              placeholder="e.g. Alex Johnson"
              className={`w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl border transition ${
                errors.fullName
                  ? 'border-rose-500 ring-1 ring-rose-500/30 bg-rose-500/5'
                  : 'border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500'
              }`}
            />
            <UserIcon className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ${errors.fullName ? 'text-rose-500' : 'text-gray-400'}`} />
          </div>
          {errors.fullName && (
            <div className="flex items-center gap-1.5 text-rose-500 text-xs font-semibold mt-1 animate-slide-up">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.fullName}</span>
            </div>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Phone Number *
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={address.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className={`w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl border transition ${
                errors.phone
                  ? 'border-rose-500 ring-1 ring-rose-500/30 bg-rose-500/5'
                  : 'border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500'
              }`}
            />
            <Phone className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ${errors.phone ? 'text-rose-500' : 'text-gray-400'}`} />
          </div>
          {errors.phone && (
            <div className="flex items-center gap-1.5 text-rose-500 text-xs font-semibold mt-1 animate-slide-up">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.phone}</span>
            </div>
          )}
        </div>

        {/* Street Address */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Street Address, Building / Flat No *
          </label>
          <div className="relative">
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleChange}
              placeholder="402 Titanium Heights, MG Road"
              className={`w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl border transition ${
                errors.street
                  ? 'border-rose-500 ring-1 ring-rose-500/30 bg-rose-500/5'
                  : 'border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500'
              }`}
            />
            <Building className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ${errors.street ? 'text-rose-500' : 'text-gray-400'}`} />
          </div>
          {errors.street && (
            <div className="flex items-center gap-1.5 text-rose-500 text-xs font-semibold mt-1 animate-slide-up">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.street}</span>
            </div>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
            placeholder="Bengaluru"
            className={`w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm px-4 py-3 rounded-xl border transition ${
              errors.city
                ? 'border-rose-500 ring-1 ring-rose-500/30 bg-rose-500/5'
                : 'border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500'
            }`}
          />
          {errors.city && (
            <div className="flex items-center gap-1.5 text-rose-500 text-xs font-semibold mt-1 animate-slide-up">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.city}</span>
            </div>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            State *
          </label>
          <input
            type="text"
            name="state"
            value={address.state}
            onChange={handleChange}
            placeholder="Karnataka"
            className={`w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm px-4 py-3 rounded-xl border transition ${
              errors.state
                ? 'border-rose-500 ring-1 ring-rose-500/30 bg-rose-500/5'
                : 'border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500'
            }`}
          />
          {errors.state && (
            <div className="flex items-center gap-1.5 text-rose-500 text-xs font-semibold mt-1 animate-slide-up">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.state}</span>
            </div>
          )}
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Postal / PIN Code *
          </label>
          <input
            type="text"
            name="postalCode"
            value={address.postalCode}
            onChange={handleChange}
            placeholder="560001"
            className={`w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm px-4 py-3 rounded-xl border transition ${
              errors.postalCode
                ? 'border-rose-500 ring-1 ring-rose-500/30 bg-rose-500/5'
                : 'border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500'
            }`}
          />
          {errors.postalCode && (
            <div className="flex items-center gap-1.5 text-rose-500 text-xs font-semibold mt-1 animate-slide-up">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.postalCode}</span>
            </div>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Country
          </label>
          <input
            type="text"
            name="country"
            disabled
            value="India"
            className="w-full bg-gray-100 dark:bg-slate-800/60 text-gray-500 text-xs sm:text-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 cursor-not-allowed font-semibold"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="flex items-center gap-2 px-8 py-3.5 bg-brand-500 text-black font-bold text-sm rounded-xl hover:bg-brand-400 shadow-neon transition active:scale-95"
        >
          <span>Continue to Delivery</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
