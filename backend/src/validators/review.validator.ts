import { z } from 'zod';

export const createReviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(5, 'Review comment must be at least 5 characters'),
});

export const createCouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  discountPercent: z.number().min(1).max(100),
  maxDiscount: z.number().positive().optional(),
  minSpend: z.number().min(0).default(0),
  expiryDate: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
  usageLimit: z.number().int().positive().optional(),
});
