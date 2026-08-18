import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  brandId: z.string().min(1, 'Brand is required'),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().optional(),
  price: z.number().positive('Price must be greater than 0'),
  discountPercent: z.number().min(0).max(100).default(0),
  stockQuantity: z.number().int().min(0).default(50),
  lowStockThreshold: z.number().int().min(1).default(10),
  isFeatured: z.boolean().optional().default(false),
  isBestSeller: z.boolean().optional().default(false),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  nutritionInfo: z.object({
    protein: z.number().min(0),
    calories: z.number().min(0),
    carbs: z.number().min(0),
    fat: z.number().min(0),
    servingSize: z.string().min(1),
    servingsPerContainer: z.number().min(1),
    bcaa: z.string().optional(),
  }),
  goalTags: z.array(z.string()).default([]),
  flavorOptions: z.array(z.string()).default([]),
  sizeOptions: z.array(z.string()).default([]),
  model3dType: z.string().optional().default('standard_jar'),
  model3dColor: z.string().optional().default('#10b981'),
  model3dLabel: z.string().optional().default('WHEY PROTEIN'),
});

export const updateProductSchema = createProductSchema.partial();
