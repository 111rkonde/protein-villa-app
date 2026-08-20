import api from './api';

export const adminService = {
  async getAnalytics() {
    const res = await api.get('/admin/analytics');
    return res.data.data;
  },

  async getDashboardStats() {
    const res = await api.get('/admin/analytics');
    return res.data.data;
  },

  async getAdminOrders(params?: Record<string, any>) {
    const res = await api.get('/admin/orders', { params });
    return res.data;
  },

  async updateOrderStatus(orderId: string, status: string) {
    const res = await api.put(`/admin/orders/${orderId}/status`, { status });
    return res.data.data;
  },

  async createProduct(data: any) {
    const res = await api.post('/products', data);
    return res.data.data;
  },

  async updateProduct(id: string, data: any) {
    const res = await api.put(`/products/${id}`, data);
    return res.data.data;
  },

  async deleteProduct(id: string) {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  async getUsers(params?: Record<string, any>) {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  async toggleUserStatus(userId: string) {
    const res = await api.put(`/admin/users/${userId}/toggle`);
    return res.data.data;
  },

  async getInventory() {
    const res = await api.get('/admin/inventory');
    return res.data.data;
  },

  async updateStock(productId: string, quantity: number, note?: string) {
    const res = await api.put(`/admin/inventory/${productId}`, { quantity, note });
    return res.data.data;
  },

  async getCoupons() {
    const res = await api.get('/coupons');
    return res.data.data;
  },

  async createCoupon(data: any) {
    const res = await api.post('/coupons', data);
    return res.data.data;
  },

  async toggleCoupon(id: string) {
    const res = await api.put(`/coupons/${id}/toggle`);
    return res.data.data;
  },

  async deleteCoupon(id: string) {
    const res = await api.delete(`/coupons/${id}`);
    return res.data;
  },

  // Bank Accounts & Payout Priority Management
  async getBankAccounts() {
    const res = await api.get('/admin/banks');
    return res.data.data;
  },

  async addBankAccount(data: any) {
    const res = await api.post('/admin/banks', data);
    return res.data.data;
  },

  async setPrimaryBank(bankId: string) {
    const res = await api.put(`/admin/banks/${bankId}/primary`);
    return res.data.data;
  },

  async updateBankAccount(bankId: string, data: any) {
    const res = await api.put(`/admin/banks/${bankId}`, data);
    return res.data.data;
  },

  async deleteBankAccount(bankId: string) {
    const res = await api.delete(`/admin/banks/${bankId}`);
    return res.data.data;
  },

  async getActiveBank() {
    const res = await api.get('/payments/active-bank');
    return res.data.data;
  },

  // Payment Gateway Plugins Management
  async getGatewayPlugins() {
    const res = await api.get('/admin/gateway-plugins');
    return res.data.data;
  },

  async updateGatewayPlugin(id: string, data: any) {
    const res = await api.put(`/admin/gateway-plugins/${id}`, data);
    return res.data.data;
  },

  async activateGatewayPlugin(id: string) {
    const res = await api.put(`/admin/gateway-plugins/${id}/activate`);
    return res.data.data;
  },

  async testGatewayPlugin(id: string) {
    const res = await api.post(`/admin/gateway-plugins/${id}/test`);
    return res.data.data;
  },

  async getActiveGateway() {
    const res = await api.get('/payments/active-gateway');
    return res.data.data;
  },

  async generateGatewayQr(amount: number, orderNumber?: string) {
    const res = await api.post('/payments/gateway-qr/generate', { amount, orderNumber });
    return res.data.data;
  },

  async verifyGatewayPayment(data: { utrNumber: string; amount: number; sessionId?: string }) {
    const res = await api.post('/payments/gateway-qr/verify', data);
    return res.data.data;
  },
};

