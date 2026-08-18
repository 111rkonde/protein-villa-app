import api from './api';
import { VerificationResult } from '../types';

export const verifyService = {
  async verifyCode(code: string): Promise<VerificationResult> {
    const res = await api.get(`/verify/${code}`);
    return res.data.data;
  },
};
