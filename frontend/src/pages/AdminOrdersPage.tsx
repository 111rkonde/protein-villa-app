import React, { useState, useEffect } from 'react';
import { Truck, Search, Eye, CheckCircle2, AlertCircle, Clock, Package, Printer, FileText } from 'lucide-react';
import { adminService } from '../services/admin.service';
import { Order } from '../types';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { OrderInvoiceModal } from '../components/admin/OrderInvoiceModal';

export const AdminOrdersPage: React.FC = () => {
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  // Invoice Print Modal State
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAdminOrders({
        status: statusFilter || undefined,
        limit: 50,
      });
      const orderList = Array.isArray(res) ? res : (res.data || res.orders || []);
      setOrders(orderList);
    } catch (error) {
      console.error('Failed to load admin orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}! 📦`, 'success');
      await fetchOrders();
    } catch (error) {
      showToast('Failed to update order status.', 'error');
    }
  };

  const handleOpenInvoice = (order: Order) => {
    setSelectedOrderForInvoice(order);
    setIsInvoiceModalOpen(true);
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
            Fulfillment Management
          </span>
          <h1 className="font-display text-3xl font-black text-gray-900 dark:text-white mt-1">
            Customer Orders ({orders.length})
          </h1>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order # or Customer Name..."
              className="w-full bg-white dark:bg-dark-surface text-gray-900 dark:text-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 font-semibold"
            />
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white dark:bg-dark-surface text-xs font-bold text-gray-900 dark:text-white p-2.5 rounded-xl border border-gray-200 dark:border-slate-800"
            >
              <option value="">All Statuses</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching customer orders..." />
        ) : (
          <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                <tr>
                  <th className="p-4 font-bold text-gray-400 uppercase">Order #</th>
                  <th className="p-4 font-bold text-gray-400 uppercase">Customer</th>
                  <th className="p-4 font-bold text-gray-400 uppercase">Items</th>
                  <th className="p-4 font-bold text-gray-400 uppercase">Total (₹)</th>
                  <th className="p-4 font-bold text-gray-400 uppercase">Payment</th>
                  <th className="p-4 font-bold text-gray-400 uppercase">Status & Logistics</th>
                  <th className="p-4 font-bold text-gray-400 uppercase text-right">Packing Slip & Bill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/30 transition">
                    <td className="p-4 font-mono font-bold text-gray-900 dark:text-white">
                      #{o.orderNumber}
                      <div className="text-[10px] text-gray-400 font-sans">
                        {new Date(o.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-gray-900 dark:text-white">
                        {o.shippingAddress?.fullName || 'Guest Customer'}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {o.shippingAddress?.city}, {o.shippingAddress?.state}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {o.items?.length} products
                      </div>
                      <div className="text-[11px] text-gray-400 truncate max-w-xs">
                        {o.items?.map((i) => i.productName).join(', ')}
                      </div>
                    </td>

                    <td className="p-4 font-display font-black text-sm text-brand-500">
                      ₹{o.total.toLocaleString('en-IN')}
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-gray-700 dark:text-gray-300">
                        {o.paymentMethod}
                      </span>
                      <div className="text-[10px] text-emerald-500 font-bold">
                        {o.paymentStatus}
                      </div>
                    </td>

                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                        className={`text-xs font-bold p-2 rounded-xl border cursor-pointer ${
                          o.status === 'DELIVERED'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                            : o.status === 'SHIPPED'
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                            : o.status === 'CANCELLED'
                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <option value="PENDING" className="bg-slate-900 text-white">Pending</option>
                        <option value="PROCESSING" className="bg-slate-900 text-white">Processing</option>
                        <option value="SHIPPED" className="bg-slate-900 text-white">Shipped</option>
                        <option value="DELIVERED" className="bg-slate-900 text-white">Delivered</option>
                        <option value="CANCELLED" className="bg-slate-900 text-white">Cancelled</option>
                      </select>
                    </td>

                    {/* Print / Download Invoice Action */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenInvoice(o)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-black text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl border border-gray-200 dark:border-slate-700 transition shadow-sm group"
                        title="Print Tax Invoice & Shipping Packing Slip"
                      >
                        <Printer className="w-3.5 h-3.5 text-brand-500 group-hover:text-black transition" />
                        <span>Print Bill</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Dedicated Tax Invoice & Warehouse Packing Slip Modal */}
        <OrderInvoiceModal
          order={selectedOrderForInvoice}
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
        />
      </div>
    </div>
  );
};
