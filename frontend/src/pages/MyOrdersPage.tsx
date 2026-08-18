import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, ArrowRight, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { orderService } from '../services/order.service';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const MyOrdersPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">Please Log In</h2>
        <p className="text-gray-400 text-sm">Sign in to view your order history and live shipping status.</p>
        <Link to="/login" className="px-6 py-2.5 bg-brand-500 text-black font-bold text-xs rounded-xl">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Retrieving order history..." fullPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-10 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
            Account Management
          </span>
          <h1 className="font-display text-3xl font-black text-gray-900 dark:text-white mt-1">
            My Order History ({orders.length})
          </h1>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl overflow-hidden space-y-4"
              >
                {/* Header */}
                <div className="p-5 sm:p-6 bg-gray-50/80 dark:bg-slate-900/60 border-b border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white font-mono text-sm">
                      Order #{order.orderNumber}
                    </div>
                    <div className="text-gray-400 mt-0.5">
                      Placed on{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-black uppercase tracking-wider px-3 py-1 rounded-full text-[11px] ${
                        order.status === 'DELIVERED'
                          ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                          : order.status === 'SHIPPED'
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                          : order.status === 'CANCELLED'
                          ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {order.status}
                    </span>

                    <Link
                      to={`/orders/${order.orderNumber}`}
                      className="flex items-center gap-1 px-4 py-2 bg-brand-500 text-black font-black text-xs rounded-xl hover:bg-brand-400 shadow-neon transition"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Order</span>
                    </Link>
                  </div>
                </div>

                {/* Items */}
                <div className="p-5 sm:p-6 space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs py-2 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.productImage || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=100'}
                          alt={item.productName}
                          className="w-12 h-12 object-contain rounded-xl bg-gray-50 dark:bg-slate-800 p-1"
                        />
                        <div>
                          <div className="font-bold text-sm text-gray-900 dark:text-white">
                            {item.productName}
                          </div>
                          <div className="text-gray-400 text-[11px]">
                            {item.flavor} • {item.size} • Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-gray-900 dark:text-white font-display text-sm">
                        ₹{item.totalPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Total */}
                <div className="p-5 sm:p-6 bg-gray-50/50 dark:bg-slate-900/30 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div className="text-gray-400">
                    Payment Method: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 mr-2">Total Paid:</span>
                    <span className="text-lg font-black text-brand-500 font-display">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-surface p-12 rounded-3xl border border-gray-200 dark:border-slate-800 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-gray-400">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
              No Orders Found
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              You have not placed any supplement orders yet. Start your fitness stack today!
            </p>
            <Link
              to="/products"
              className="inline-block px-6 py-2.5 bg-brand-500 text-black font-bold text-xs rounded-xl hover:bg-brand-400 shadow-neon"
            >
              Shop Catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
