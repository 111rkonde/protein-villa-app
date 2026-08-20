import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email cannot exceed 255 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password cannot exceed 128 characters'),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+ -]{8,20}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password cannot exceed 128 characters'),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+ -]{8,20}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  avatar: z.string().url('Avatar must be a valid URL').optional().or(z.literal('')),
  weight: z.number().positive('Weight must be positive').max(500).optional(),
  height: z.number().positive('Height must be positive').max(300).optional(),
  fitnessGoal: z.string().max(100).optional(),
  activityLevel: z.string().max(50).optional(),
  dailyProteinTarget: z.number().positive('Target must be positive').max(1000).optional(),
});
