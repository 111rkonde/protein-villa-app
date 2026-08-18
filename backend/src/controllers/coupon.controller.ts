import { Request, Response } from 'express';
import { CouponService } from '../services/coupon.service';
import { sendSuccess, sendError } from '../utils/response';

export class CouponController {
  static async getAllCoupons(req: Request, res: Response): Promise<void> {
    try {
      const coupons = await CouponService.getAllCoupons();
      sendSuccess(res, coupons);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async validateCoupon(req: Request, res: Response): Promise<void> {
    try {
      const { code, subtotal } = req.body;
      const result = await CouponService.validateCoupon(code, subtotal ? Number(subtotal) : 0);
      sendSuccess(res, result, 'Coupon applied successfully!');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async createCoupon(req: Request, res: Response): Promise<void> {
    try {
      const coupon = await CouponService.createCoupon(req.body);
      sendSuccess(res, coupon, 'Coupon created successfully.', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async deleteCoupon(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await CouponService.deleteCoupon(id);
      sendSuccess(res, null, 'Coupon deleted.');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async toggleStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await CouponService.toggleCouponStatus(id);
      sendSuccess(res, updated, 'Coupon status updated.');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
