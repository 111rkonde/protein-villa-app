import api from './api';
import { User } from '../types';

export const authService = {
  async register(data: { name: string; email: string; password: string; phone?: string; role?: string }) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get('/auth/me');
    return res.data.data;
  },

  async updateProfile(data: Partial<User>) {
    const res = await api.put('/auth/profile', data);
    return res.data.data;
  },

  async forgotPassword(email: string) {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },

  async resetPassword(token: string, newPassword: string) {
    const res = await api.post('/auth/reset-password', { token, newPassword });
    return res.data;
  },
};
