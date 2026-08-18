import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, CheckCircle2, Plus, ArrowUpRight } from 'lucide-react';
import { adminService } from '../services/admin.service';
import { productService } from '../services/product.service';
import { Product } from '../types';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AdminInventoryPage: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts({ limit: 50 });
      setProducts(res.data || []);
    } catch (error) {
      console.error('Failed to load inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdateStock = async (productId: string, currentStock: number, delta: number) => {
    const newQty = Math.max(0, currentStock + delta);
    try {
      await adminService.updateProduct(productId, { stockQuantity: newQty });
      showToast(`Stock updated to ${newQty} units.`, 'success');
      await fetchInventory();
    } catch (error) {
      showToast('Failed to adjust stock quantity.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
            Warehouse Logistics
          </span>
          <h1 className="font-display text-3xl font-black text-gray-900 dark:text-white mt-1">
            Live Inventory Management
          </h1>
        </div>

        {loading ? (
          <LoadingSpinner message="Scanning warehouse inventory balances..." />
        ) : (
          <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                <tr>
                  <th className="p-4 font-bold text-gray-400 uppercase">Supplement</th>
                  <th className="p-4 font-bold text-gray-400 uppercase">SKU / Brand</th>
                  <th className="p-4 font-bold text-gray-400 uppercase">Unit Price</th>
                  <th className="p-4 font-bold text-gray-400 uppercase">Available Stock</th>
                  <th className="p-4 font-bold text-gray-400 uppercase">Status</th>
                  <th className="p-4 font-bold text-gray-400 uppercase text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/30 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 object-contain rounded-xl bg-gray-50 dark:bg-slate-800 p-1"
                        />
                        <div className="font-bold text-sm text-gray-900 dark:text-white">
                          {p.name}
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-gray-400 font-mono">
                      {p.brand?.name}
                    </td>

                    <td className="p-4 font-display font-bold text-sm text-gray-900 dark:text-white">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>

                    <td className="p-4">
                      <span className="font-display font-black text-base text-gray-900 dark:text-white">
                        {p.stockQuantity}
                      </span>
                      <span className="text-[11px] text-gray-400 ml-1">tubs</span>
                    </td>

                    <td className="p-4">
                      {p.stockQuantity <= 10 ? (
                        <span className="inline-flex items-center gap-1 text-rose-500 font-bold bg-rose-500/10 px-2.5 py-1 rounded-full text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>LOW STOCK</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Optimal</span>
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleUpdateStock(p.id, p.stockQuantity, 10)}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-brand-500 text-gray-700 dark:text-white hover:text-black font-bold text-xs transition"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleUpdateStock(p.id, p.stockQuantity, 50)}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-brand-500 text-gray-700 dark:text-white hover:text-black font-bold text-xs transition"
                        >
                          +50
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
