import api from './api';
import { Order } from '../types';

export const orderService = {
  async createOrder(data: any): Promise<Order> {
    const res = await api.post('/orders', data);
    return res.data.data;
  },

  async getMyOrders(): Promise<Order[]> {
    const res = await api.get('/orders/my-orders');
    return res.data.data;
  },

  async getOrderById(id: string): Promise<Order> {
    const res = await api.get(`/orders/${id}`);
    return res.data.data;
  },

  async trackOrder(orderNumber: string) {
    const res = await api.get(`/orders/track/${orderNumber}`);
    return res.data.data;
  },

  // Admin
  async getAllOrders(params?: Record<string, any>) {
    const res = await api.get('/orders', { params });
    return res.data;
  },

  async updateOrderStatus(id: string, status: string, trackingNumber?: string, estimatedDelivery?: string) {
    const res = await api.put(`/orders/${id}/status`, { status, trackingNumber, estimatedDelivery });
    return res.data.data;
  },
};
