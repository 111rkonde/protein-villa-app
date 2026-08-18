import { Router } from 'express';
import { CouponController } from '../controllers/coupon.controller';
import { authenticateUser, authorizeRoles } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createCouponSchema } from '../validators/coupon.validator';

const router = Router();

router.post('/validate', CouponController.validateCoupon);

// Admin Coupon Management
router.get('/', authenticateUser, authorizeRoles('ADMIN'), CouponController.getAllCoupons);
router.post(
  '/',
  authenticateUser,
  authorizeRoles('ADMIN'),
  validateRequest(createCouponSchema),
  CouponController.createCoupon
);
router.put('/:id/toggle', authenticateUser, authorizeRoles('ADMIN'), CouponController.toggleStatus);
router.delete('/:id', authenticateUser, authorizeRoles('ADMIN'), CouponController.deleteCoupon);

export default router;
