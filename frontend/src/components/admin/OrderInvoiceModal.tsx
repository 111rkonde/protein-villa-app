import React, { useEffect } from 'react';
import { Printer, X, ShieldCheck, QrCode, CheckCircle2, Truck, FileText, Download } from 'lucide-react';
import { Order } from '../../types';

interface OrderInvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({ order, isOpen, onClose }) => {
  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md transition-all"
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full max-h-[92vh] flex flex-col bg-white text-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 animate-scale-up"
      >
        {/* STICKY TOP CONTROLS BAR (ALWAYS VISIBLE, HIDDEN IN PRINT) */}
        <div className="print:hidden sticky top-0 z-30 flex items-center justify-between px-5 sm:px-8 py-3.5 bg-slate-950 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">
                Tax Invoice & Warehouse Packing Slip
              </div>
              <div className="text-[11px] text-gray-400 font-mono">
                Order #{order.orderNumber}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-black font-black text-xs rounded-xl hover:bg-brand-400 shadow-neon transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Bill / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-slate-800 transition active:scale-95"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE PRINTABLE INVOICE BODY */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 text-gray-900 bg-white" id="printable-invoice">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-2xl tracking-wider text-slate-950">
                  PROTEIN<span className="text-emerald-600">VILLA</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                  HPLC LAB CERTIFIED
                </span>
              </div>
              <p className="text-[11px] text-gray-600 mt-1.5 max-w-sm leading-relaxed">
                <strong>Protein Villa Health & Sports Nutrition Pvt. Ltd.</strong><br />
                Warehouse Hub: Plot 42, Nutrition Logistics Park, Pune, MH 411018<br />
                GSTIN: <strong>27AAECP1234F1Z5</strong> | FSSAI Lic: <strong>10020021000492</strong><br />
                Support: care@proteinvilla.demo | Helpline: +91 1800-890-7865
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="inline-block px-3 py-1 bg-slate-900 text-white font-mono text-xs font-black rounded mb-2">
                TAX INVOICE / PACKING SLIP
              </div>
              <div className="text-xs space-y-1 font-mono text-gray-700">
                <div>Order #: <strong className="text-sm font-black text-slate-950">{order.orderNumber}</strong></div>
                <div>Invoice Date: <strong>{formattedDate}</strong></div>
                <div>Tracking #: <strong>{order.trackingNumber || 'TRK-AIR-LOGISTICS'}</strong></div>
                <div>Payment Mode: <strong className="uppercase">{order.paymentMethod} ({order.paymentStatus})</strong></div>
              </div>
            </div>
          </div>

          {/* Shipping & Billing Address Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs">
            <div>
              <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block mb-1">
                SHIP TO / DELIVERY DESTINATION:
              </span>
              <div className="font-bold text-sm text-gray-950">
                {order.shippingAddress?.fullName || 'Valued Athlete Customer'}
              </div>
              <div className="text-gray-700 leading-relaxed mt-0.5">
                {order.shippingAddress?.street}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}<br />
                {order.shippingAddress?.country || 'India'}<br />
                Phone: <strong>{order.shippingAddress?.phone}</strong>
              </div>
            </div>

            <div className="sm:border-l border-gray-200 sm:pl-6 space-y-2">
              <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block mb-1">
                COURIER & LOGISTICS DETAILS:
              </span>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-gray-900">Air Express Priority Dispatch</span>
              </div>
              <div className="text-[11px] text-gray-600">
                Estimated Delivery: <strong>{order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Within 48-72 Hours'}</strong>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Tamper-Proof Hologram Sealed Packaging</span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Supplement Item</th>
                  <th className="p-3">Flavor & Size</th>
                  <th className="p-3 text-center">HSN</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price (₹)</th>
                  <th className="p-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items?.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-gray-50">
                    <td className="p-3 font-mono font-bold text-gray-500">{idx + 1}</td>
                    <td className="p-3 font-bold text-gray-900">{item.productName}</td>
                    <td className="p-3 text-gray-600">{item.flavor} • {item.size}</td>
                    <td className="p-3 text-center font-mono text-gray-500">21061000</td>
                    <td className="p-3 text-center font-bold">{item.quantity}</td>
                    <td className="p-3 text-right font-mono">₹{item.unitPrice?.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-mono font-bold">₹{item.totalPrice?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Stamp Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-end pt-2">
            {/* Left: Barcode / Authenticity Seal */}
            <div className="sm:col-span-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% HPLC Lab Purity Verified Guarantee</span>
              </div>
              <p className="text-[10px] text-gray-600 leading-tight">
                This package has undergone strict quality audit and heavy-metal testing before dispatch. Scan batch authenticity barcode on tub via proteinvilla.demo/verify.
              </p>
              <div className="font-mono text-[10px] font-bold text-slate-700 tracking-widest pt-1 border-t border-emerald-200">
                |||||||| |||| |||||||||||| |||||| ||||||| PV-{order.orderNumber}
              </div>
            </div>

            {/* Right: Calculations */}
            <div className="sm:col-span-6 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal:</span>
                <span className="font-mono font-bold text-gray-900">₹{order.subtotal?.toLocaleString('en-IN')}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount ({order.couponCode || 'PROMO'}):</span>
                  <span className="font-mono">- ₹{order.discount?.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Shipping / Logistics:</span>
                <span className="font-mono">{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>GST (5% Supplement Tax):</span>
                <span className="font-mono">₹{order.tax?.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t-2 border-slate-900 text-base font-black text-slate-950 font-display">
                <span>Grand Total:</span>
                <span className="text-emerald-600 font-mono">₹{order.total?.toLocaleString('en-IN')}</span>
              </div>

              <div className="text-[11px] font-bold text-gray-500 pt-1">
                Amount Paid: <strong className="text-gray-950">{order.paymentStatus === 'PAID' ? `₹${order.total?.toLocaleString('en-IN')}` : '₹0.00 (Collect on Delivery)'}</strong>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-gray-200 text-center text-[10px] text-gray-500">
            This is a computer-generated tax invoice and packing slip. No physical signature is required. Thank you for choosing Protein Villa!
          </div>
        </div>

        {/* STICKY BOTTOM ACTION BAR (ALWAYS VISIBLE, HIDDEN IN PRINT) */}
        <div className="print:hidden sticky bottom-0 z-30 flex items-center justify-between px-5 sm:px-8 py-3 bg-gray-50 border-t border-gray-200 shrink-0 text-xs">
          <span className="text-gray-500 font-medium hidden sm:inline">
            Press <kbd className="px-2 py-0.5 bg-gray-200 rounded font-mono text-[10px] font-bold">ESC</kbd> or click outside to close
          </span>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-200 transition"
            >
              Close
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-2 bg-brand-500 text-black font-black text-xs rounded-xl hover:bg-brand-400 shadow-neon transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Bill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
