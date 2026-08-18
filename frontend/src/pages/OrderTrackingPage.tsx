import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Truck, CheckCircle2, Clock, Package, MapPin, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import { orderService } from '../services/order.service';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [searchCode, setSearchCode] = useState<string>(id || '');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = async (codeToSearch: string) => {
    if (!codeToSearch.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.trackOrder(codeToSearch.trim());
      setTrackingData(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'No order found with provided tracking or order number.');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTracking(id);
    }
  }, [id]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(searchCode);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-10 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto mb-3">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="font-display text-3xl font-black text-gray-900 dark:text-white">
            Live Order Tracking
          </h1>
          <p className="text-xs text-gray-400">
            Enter your Order Number (e.g. PV-2026-98124) or Tracking ID to see live dispatch status.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Enter Order # or Tracking #"
              className="w-full bg-white dark:bg-dark-surface text-gray-900 dark:text-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 font-mono font-bold"
            />
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-brand-500 text-black font-black text-xs sm:text-sm rounded-2xl hover:bg-brand-400 shadow-neon transition"
          >
            Track
          </button>
        </form>

        {loading && <LoadingSpinner message="Locating package with courier logistics..." />}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-6 rounded-3xl text-center text-xs font-bold text-rose-500 max-w-md mx-auto">
            {error}
          </div>
        )}

        {/* Tracking Details */}
        {trackingData && (
          <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl overflow-hidden animate-scale-up">
            {/* Top Bar Status */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border-b border-gray-100 dark:border-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-400 bg-brand-500/20 px-3 py-0.5 rounded-full">
                  STATUS: {trackingData.status}
                </span>
                <h3 className="font-display text-2xl font-black mt-1">
                  Order #{trackingData.orderNumber}
                </h3>
                <div className="text-xs text-gray-400">
                  Tracking Number: <strong className="text-white font-mono">{trackingData.trackingNumber || 'TRK-LOGISTICS'}</strong>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-400">Estimated Delivery</div>
                <div className="font-display text-xl font-bold text-brand-400">
                  {trackingData.estimatedDelivery
                    ? new Date(trackingData.estimatedDelivery).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Within 2-3 Days'}
                </div>
              </div>
            </div>

            {/* Visual Timeline Steps */}
            <div className="p-6 sm:p-8 space-y-8">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">
                Delivery Progression Timeline
              </h4>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200 dark:before:bg-slate-800">
                {trackingData.timeline?.map((step: any, i: number) => (
                  <div key={i} className="relative flex items-start gap-4 group">
                    <div
                      className={`absolute -left-[27px] sm:-left-[35px] w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                        step.completed
                          ? 'bg-brand-500 text-black shadow-neon ring-4 ring-brand-500/20'
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-400 border border-gray-300 dark:border-slate-700'
                      }`}
                    >
                      {step.completed ? '✓' : i + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div
                          className={`font-bold text-sm sm:text-base ${
                            step.completed
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-400 dark:text-gray-600'
                          }`}
                        >
                          {step.label}
                        </div>
                        {step.date && (
                          <span className="text-[11px] font-bold text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded-md">
                            {step.date}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ordered Items Accordion */}
            <div className="p-6 sm:p-8 bg-gray-50/50 dark:bg-slate-900/40 border-t border-gray-100 dark:border-slate-800 space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">
                Package Contents ({trackingData.items?.length || 0} items)
              </h4>

              <div className="space-y-3">
                {trackingData.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productImage || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=100'}
                        alt={item.productName}
                        className="w-12 h-12 object-contain rounded-lg bg-gray-50 dark:bg-slate-800 p-1"
                      />
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {item.productName}
                        </div>
                        <div className="text-gray-400 text-[11px]">
                          {item.flavor} • {item.size} • Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white font-display text-sm">
                      ₹{item.totalPrice?.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
