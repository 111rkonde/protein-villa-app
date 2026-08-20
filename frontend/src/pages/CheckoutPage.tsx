import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Truck, CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/order.service';
import { Address } from '../types';
import { AddressStep } from '../components/checkout/AddressStep';
import { DeliveryStep } from '../components/checkout/DeliveryStep';
import { PaymentStep } from '../components/checkout/PaymentStep';
import { ReviewStep } from '../components/checkout/ReviewStep';

export const CheckoutPage: React.FC = () => {
  const { user } = useAuth();
  const { items, subtotal, discount, shippingFee, tax, total, couponCode, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form states
  const [address, setAddress] = useState<Address>({
    id: '',
    userId: user?.id || '',
    fullName: user?.name || '',
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    postalCode: user?.addresses?.[0]?.postalCode || '',
    country: 'India',
    phone: user?.phone || '',
    isDefault: true,
  });

  const [deliveryMethod, setDeliveryMethod] = useState<string>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'CARD' | 'UPI'>('COD');

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">No Items to Checkout</h2>
        <p className="text-gray-400 text-sm">Please add items to your cart before proceeding.</p>
        <Link
          to="/products"
          className="px-6 py-3 bg-brand-500 text-black font-bold text-xs rounded-xl"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          size: item.size,
          flavor: item.flavor,
          unitPrice: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: address,
        paymentMethod,
        couponCode: couponCode || undefined,
        guestEmail: !user ? 'guest@proteinvilla.demo' : undefined,
      };

      const order = await orderService.createOrder(orderData);
      await clearCart();
      showToast('🎉 Order placed successfully!', 'success');
      navigate(`/order-success/${order.orderNumber || order.id}`);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to place order.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Address', icon: <MapPin className="w-4 h-4" /> },
    { num: 2, label: 'Delivery', icon: <Truck className="w-4 h-4" /> },
    { num: 3, label: 'Payment', icon: <CreditCard className="w-4 h-4" /> },
    { num: 4, label: 'Review', icon: <CheckCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/cart"
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brand-500 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
            <ShieldCheck className="w-4 h-4" />
            <span>256-bit Secure Checkout</span>
          </div>
        </div>

        {/* Step Progression Wizard Bar */}
        <div className="grid grid-cols-4 gap-2 bg-white dark:bg-dark-surface p-3 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-md">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition ${
                currentStep === s.num
                  ? 'bg-brand-500 text-black shadow-neon'
                  : currentStep > s.num
                  ? 'text-brand-500 bg-emerald-500/10'
                  : 'text-gray-400'
              }`}
            >
              <span>{s.icon}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Main Step Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Active Step Panel */}
          <div className="lg:col-span-8 bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl">
            {currentStep === 1 && (
              <AddressStep
                address={address}
                setAddress={setAddress}
                onNext={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 2 && (
              <DeliveryStep
                deliveryMethod={deliveryMethod}
                setDeliveryMethod={setDeliveryMethod}
                onNext={() => setCurrentStep(3)}
                onPrev={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 3 && (
              <PaymentStep
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                onNext={() => setCurrentStep(4)}
                onPrev={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 4 && (
              <ReviewStep
                address={address}
                deliveryMethod={deliveryMethod}
                paymentMethod={paymentMethod}
                items={items}
                subtotal={subtotal}
                discount={discount}
                shippingFee={shippingFee}
                tax={tax}
                total={total}
                couponCode={couponCode}
                onPlaceOrder={handlePlaceOrder}
                onPrev={() => setCurrentStep(3)}
                isSubmitting={isSubmitting}
              />
            )}
          </div>

          {/* Right Order Summary Mini */}
          <div className="lg:col-span-4 bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-4">
            <h4 className="font-display text-base font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-slate-800">
              Order Items ({items.length})
            </h4>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-10 h-10 object-contain rounded-lg bg-gray-50 dark:bg-slate-800 p-1"
                    />
                    <div className="max-w-[150px] truncate">
                      <div className="font-bold text-gray-900 dark:text-white truncate">
                        {item.productName}
                      </div>
                      <div className="text-gray-400 text-[10px]">
                        Qty: {item.quantity} • {item.flavor}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white font-display">
                    ₹{item.totalPrice.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="font-bold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Discount</span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Delivery</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-500">FREE</strong> : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>GST (5%)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-slate-800 font-display">
                <span>Total</span>
                <span className="text-brand-500">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
