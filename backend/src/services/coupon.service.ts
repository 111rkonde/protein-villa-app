import prisma from '../config/db';

export class CouponService {
  static async getAllCoupons() {
    return prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async validateCoupon(code: string, subtotal: number = 0) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon || !coupon.isActive) {
      throw new Error('Invalid or expired coupon code.');
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      throw new Error('This coupon has expired.');
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new Error('Coupon usage limit has been reached.');
    }

    if (coupon.minSpend && subtotal > 0 && subtotal < coupon.minSpend) {
      throw new Error(`Minimum cart spend of ₹${coupon.minSpend} required for this coupon.`);
    }

    let discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }

    return {
      valid: true,
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      discountAmount,
      minSpend: coupon.minSpend,
      maxDiscount: coupon.maxDiscount,
    };
  }

  static async createCoupon(data: {
    code: string;
    discountPercent: number;
    maxDiscount?: number;
    minSpend?: number;
    expiryDate?: string;
    isActive?: boolean;
    usageLimit?: number;
  }) {
    const code = data.code.toUpperCase().trim();
    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      throw new Error('Coupon code already exists.');
    }

    return prisma.coupon.create({
      data: {
        code,
        discountPercent: Number(data.discountPercent),
        maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : null,
        minSpend: data.minSpend ? Number(data.minSpend) : 0,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        isActive: data.isActive !== false,
        usageLimit: data.usageLimit ? Number(data.usageLimit) : null,
      },
    });
  }

  static async deleteCoupon(id: string) {
    return prisma.coupon.delete({ where: { id } });
  }

  static async toggleCouponStatus(id: string) {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new Error('Coupon not found.');
    return prisma.coupon.update({
      where: { id },
      data: { isActive: !coupon.isActive },
    });
  }
}
