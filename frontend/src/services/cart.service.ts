import api from './api';
import { Cart } from '../types';

export const cartService = {
  async getCart(): Promise<Cart> {
    const res = await api.get('/cart');
    return res.data.data;
  },

  async addItem(data: { productId: string; size?: string; flavor?: string; quantity?: number }): Promise<Cart> {
    const res = await api.post('/cart/items', data);
    return res.data.data;
  },

  async updateQuantity(itemId: string, quantity: number): Promise<Cart> {
    const res = await api.put(`/cart/items/${itemId}`, { quantity });
    return res.data.data;
  },

  async removeItem(itemId: string) {
    const res = await api.delete(`/cart/items/${itemId}`);
    return res.data;
  },

  async clearCart(cartId: string) {
    const res = await api.post('/cart/clear', { cartId });
    return res.data;
  },

  async applyCoupon(code: string, subtotal: number) {
    const res = await api.post('/coupons/validate', { code, subtotal });
    return res.data.data;
  },
};
