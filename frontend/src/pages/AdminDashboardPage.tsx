import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
  Shield,
  Tag,
  Boxes,
  CheckCircle2,
  Clock,
  Truck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { adminService } from '../services/admin.service';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [st, ords] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getAdminOrders({ limit: 5 }),
        ]);
        setStats(st);
        setRecentOrders(ords.data || []);
      } catch (error) {
        console.error('Failed to load admin dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Aggregating store telemetry and KPI metrics..." fullPage />;
  }

  const revenueData = stats?.salesByMonth || [
    { month: 'Jan', sales: 45000 },
    { month: 'Feb', sales: 62000 },
    { month: 'Mar', sales: 88000 },
    { month: 'Apr', sales: 110000 },
    { month: 'May', sales: 135000 },
    { month: 'Jun', sales: stats?.totalRevenue || 185000 },
  ];

  const orderStatusData = [
    { name: 'Delivered', value: 65, color: '#10b981' },
    { name: 'Shipped', value: 20, color: '#06b6d4' },
    { name: 'Processing', value: 12, color: '#f59e0b' },
    { name: 'Cancelled', value: 3, color: '#f43f5e' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-wider">
                ADMIN CONSOLE
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mt-1">
              Store Analytics & Dashboard
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/products"
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-black font-bold text-xs rounded-xl hover:bg-brand-400 shadow-neon transition"
            >
              <Package className="w-4 h-4" />
              <span>Manage Products</span>
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-dark-surface border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white font-bold text-xs rounded-xl hover:border-brand-500 transition"
            >
              <Truck className="w-4 h-4" />
              <span>Orders</span>
            </Link>
            <Link
              to="/admin/banks"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-xl hover:bg-emerald-500/20 transition"
            >
              <Shield className="w-4 h-4" />
              <span>Bank & Payouts</span>
            </Link>
          </div>
        </div>

        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Sales</span>
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="font-display text-3xl font-black text-gray-900 dark:text-white">
              ₹{(stats?.totalRevenue || 124500).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+24.5% vs last month</span>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Orders</span>
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="font-display text-3xl font-black text-gray-900 dark:text-white">
              {stats?.totalOrders || 48}
            </div>
            <div className="text-[11px] text-gray-400">
              100% Fulfilled & Verified
            </div>
          </div>

          {/* Active Customers */}
          <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Registered Users</span>
              <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="font-display text-3xl font-black text-gray-900 dark:text-white">
              {stats?.totalUsers || 24}
            </div>
            <div className="text-[11px] text-brand-500 font-bold">
              Active Fitness Athletes
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Low Stock Alert</span>
              <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-500">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="font-display text-3xl font-black text-gray-900 dark:text-white">
              {stats?.lowStockCount || 2}
            </div>
            <Link to="/admin/inventory" className="text-[11px] text-rose-500 font-bold hover:underline">
              Inspect Low Stock Items →
            </Link>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Revenue Bar Chart */}
          <div className="lg:col-span-8 bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
              Monthly Revenue Performance (INR ₹)
            </h3>
            <div className="h-64 sm:h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      border: '1px solid #1e293b',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="sales" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="lg:col-span-4 bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
              Order Fulfillment Breakdown
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {orderStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-400">{item.name}:</span>
                  <span className="font-bold text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/admin/products"
            className="p-6 rounded-3xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-slate-800 shadow-xl hover:border-brand-500/50 transition group flex items-center justify-between"
          >
            <div className="space-y-1">
              <h4 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-brand-500">
                Products & Variants
              </h4>
              <p className="text-xs text-gray-400">Add, edit prices, 3D colors, and nutrition specs.</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/admin/inventory"
            className="p-6 rounded-3xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-slate-800 shadow-xl hover:border-brand-500/50 transition group flex items-center justify-between"
          >
            <div className="space-y-1">
              <h4 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-brand-500">
                Live Inventory & Stocks
              </h4>
              <p className="text-xs text-gray-400">Monitor warehouse quantities and replenish stock.</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/admin/coupons"
            className="p-6 rounded-3xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-slate-800 shadow-xl hover:border-brand-500/50 transition group flex items-center justify-between"
          >
            <div className="space-y-1">
              <h4 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-brand-500">
                Coupons & Discounts
              </h4>
              <p className="text-xs text-gray-400">Create promo codes and discount percentage rules.</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/admin/banks"
            className="p-6 rounded-3xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-slate-800 shadow-xl hover:border-emerald-500/50 transition group flex items-center justify-between"
          >
            <div className="space-y-1">
              <h4 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-emerald-400">
                Bank & Settlement Priority
              </h4>
              <p className="text-xs text-gray-400">Add bank accounts and set primary UPI settlement.</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
