import { Request } from 'express';

export type UserRole = 'USER' | 'ADMIN';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export interface NutritionInfo {
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  servingSize: string;
  servingsPerContainer: number;
  bcaa?: string;
}

export interface ShippingAddressInput {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  phone: string;
}
