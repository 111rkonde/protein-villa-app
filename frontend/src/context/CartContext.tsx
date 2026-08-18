import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cart, CartItem } from '../types';
import { cartService } from '../services/cart.service';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: Cart | null;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  amountForFreeShipping: number;
  couponCode: string | null;
  isLoading: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (data: { productId: string; size?: string; flavor?: string; quantity?: number; productName?: string }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const { showToast } = useToast();

  const refreshCart = useCallback(async () => {
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.warn('Failed to load cart from server:', error);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (data: {
    productId: string;
    size?: string;
    flavor?: string;
    quantity?: number;
    productName?: string;
  }) => {
    setIsLoading(true);
    try {
      const updated = await cartService.addItem(data);
      setCart(updated);
      showToast(`Added ${data.productName || 'product'} to cart! 🛒`, 'success');
      setIsCartOpen(true);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to add item to cart.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const updated = await cartService.updateQuantity(itemId, quantity);
      setCart(updated);
    } catch (error: any) {
      showToast('Failed to update quantity.', 'error');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await cartService.removeItem(itemId);
      await refreshCart();
      showToast('Item removed from cart.', 'info');
    } catch (error: any) {
      showToast('Failed to remove item.', 'error');
    }
  };

  const clearCart = async () => {
    if (!cart) return;
    try {
      await cartService.clearCart(cart.id);
      await refreshCart();
      setCouponCode(null);
      setCouponDiscount(0);
    } catch (error: any) {
      showToast('Failed to clear cart.', 'error');
    }
  };

  const applyCoupon = async (code: string) => {
    if (!cart || cart.items.length === 0) {
      showToast('Add products to cart before applying coupon.', 'warning');
      return;
    }
    try {
      const res = await cartService.applyCoupon(code, cart.subtotal);
      setCouponCode(res.code);
      setCouponDiscount(res.discountAmount);
      showToast(`Coupon '${res.code}' applied! Saved ₹${res.discountAmount.toLocaleString('en-IN')}`, 'success');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Invalid coupon code.';
      showToast(msg, 'error');
      throw error;
    }
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setCouponDiscount(0);
    showToast('Coupon removed.', 'info');
  };

  const rawSubtotal = cart?.subtotal || 0;
  const effectiveDiscount = couponDiscount;
  const discountedSubtotal = Math.max(0, rawSubtotal - effectiveDiscount);
  const shippingFee = rawSubtotal === 0 || discountedSubtotal >= 999 ? 0 : 99;
  const tax = Math.round(discountedSubtotal * 0.05);
  const total = rawSubtotal === 0 ? 0 : discountedSubtotal + shippingFee + tax;
  const amountForFreeShipping = Math.max(0, 999 - discountedSubtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart?.items || [],
        itemCount: cart?.itemCount || 0,
        subtotal: rawSubtotal,
        discount: effectiveDiscount,
        shippingFee,
        tax,
        total,
        amountForFreeShipping,
        couponCode,
        isLoading,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
