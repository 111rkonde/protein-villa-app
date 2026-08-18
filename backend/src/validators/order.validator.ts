import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      productName: z.string().min(1),
      productImage: z.string().optional(),
      size: z.string().default('Standard'),
      flavor: z.string().default('Default'),
      unitPrice: z.number().positive(),
      quantity: z.number().int().min(1),
    })
  ).min(1, 'Order must contain at least one item'),
  shippingAddress: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    street: z.string().min(3, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    postalCode: z.string().min(4, 'Postal code is required'),
    country: z.string().default('India'),
    phone: z.string().min(8, 'Phone number is required'),
  }),
  paymentMethod: z.enum(['COD', 'CARD', 'UPI']).default('COD'),
  couponCode: z.string().optional(),
  customerNotes: z.string().optional(),
  guestEmail: z.string().email().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ]),
  trackingNumber: z.string().optional(),
  estimatedDelivery: z.string().optional(),
});
