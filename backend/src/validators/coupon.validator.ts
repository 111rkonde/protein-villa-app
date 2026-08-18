import { z } from 'zod';

export const createCouponSchema = z.object({
  code: z.string().min(3).max(20),
  discountPercent: z.number().min(1).max(100),
  maxDiscount: z.number().positive().optional(),
  minSpend: z.number().min(0).default(0),
  expiryDate: z.string().optional(),
  isActive: z.boolean().default(true),
  usageLimit: z.number().int().positive().optional(),
});
