import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().trim().min(2, 'Product name is required'),
  brandId: z.string().min(1, 'Brand is required'),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().trim().min(2, 'Description must be at least 2 characters'),
  shortDescription: z.string().trim().optional(),
  price: z.coerce.number().positive('Price must be greater than 0'),
  discountPercent: z.coerce.number().min(0).max(100).default(0),
  stockQuantity: z.coerce.number().int().min(0).default(50),
  lowStockThreshold: z.coerce.number().int().min(1).default(10),
  isFeatured: z.boolean().optional().default(false),
  isBestSeller: z.boolean().optional().default(false),
  images: z
    .array(z.string().min(1))
    .min(1, 'At least one image is required')
    .default(['https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600']),
  nutritionInfo: z
    .object({
      protein: z.coerce.number().min(0).default(0),
      calories: z.coerce.number().min(0).default(0),
      carbs: z.coerce.number().min(0).default(0),
      fat: z.coerce.number().min(0).default(0),
      servingSize: z.string().default('30g (1 Scoop)'),
      servingsPerContainer: z.coerce.number().min(1).default(30),
      bcaa: z.string().optional().default(''),
    })
    .optional()
    .default({
      protein: 25,
      calories: 120,
      carbs: 2,
      fat: 1,
      servingSize: '30g (1 Scoop)',
      servingsPerContainer: 30,
      bcaa: '5g BCAA',
    }),
  goalTags: z.array(z.string()).default([]),
  flavorOptions: z.array(z.string()).default([]),
  sizeOptions: z.array(z.string()).default([]),
  model3dType: z.string().optional().default('standard_jar'),
  model3dColor: z.string().optional().default('#10b981'),
  model3dLabel: z.string().optional().default('WHEY PROTEIN'),
  verificationCode: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();
