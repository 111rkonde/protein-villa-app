import React from 'react';
import { Address } from '../../types';
import { MapPin, Phone, User as UserIcon, Building, ArrowRight } from 'lucide-react';

interface AddressStepProps {
  address: Address;
  setAddress: React.Dispatch<React.SetStateAction<Address>>;
  onNext: () => void;
}

export const AddressStep: React.FC<AddressStepProps> = ({ address, setAddress, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-slate-800">
        <MapPin className="w-5 h-5 text-brand-500" />
        <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
          Shipping Address
        </h3>
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
              required
              value={address.fullName}
              onChange={handleChange}
              placeholder="e.g. Alex Johnson"
              className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500"
            />
            <UserIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
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
              required
              value={address.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500"
            />
            <Phone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
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
              required
              value={address.street}
              onChange={handleChange}
              placeholder="402 Titanium Heights, MG Road"
              className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500"
            />
            <Building className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            City *
          </label>
          <input
            type="text"
            name="city"
            required
            value={address.city}
            onChange={handleChange}
            placeholder="Bengaluru"
            className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            State *
          </label>
          <input
            type="text"
            name="state"
            required
            value={address.state}
            onChange={handleChange}
            placeholder="Karnataka"
            className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Postal / PIN Code *
          </label>
          <input
            type="text"
            name="postalCode"
            required
            value={address.postalCode}
            onChange={handleChange}
            placeholder="560001"
            className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500"
          />
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
          className="flex items-center gap-2 px-8 py-3.5 bg-brand-500 text-black font-bold text-sm rounded-xl hover:bg-brand-400 shadow-neon transition"
        >
          <span>Continue to Delivery</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
