import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticateUser, optionalAuth, authorizeRoles } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.validator';

const router = Router();

// Checkout / Place Order (Authenticated Users ONLY)
router.post('/', authenticateUser, validateRequest(createOrderSchema), OrderController.createOrder);

// Order tracking (Public with orderNumber / trackingNumber)
router.get('/track/:orderNumber', OrderController.trackOrder);

// User orders
router.get('/my-orders', authenticateUser, OrderController.getMyOrders);
router.get('/:id', optionalAuth, OrderController.getOrderById);

// Admin Order Management
router.get('/', authenticateUser, authorizeRoles('ADMIN'), OrderController.getAllOrders);
router.put(
  '/:id/status',
  authenticateUser,
  authorizeRoles('ADMIN'),
  validateRequest(updateOrderStatusSchema),
  OrderController.updateStatus
);

export default router;
