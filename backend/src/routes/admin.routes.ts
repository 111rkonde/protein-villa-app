import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { OrderController } from '../controllers/order.controller';
import { authenticateUser, authorizeRoles } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { updateOrderStatusSchema } from '../validators/order.validator';

const router = Router();

// Protect ALL admin routes with authenticateUser + authorizeRoles('ADMIN')
router.use(authenticateUser, authorizeRoles('ADMIN'));

router.get('/analytics', AdminController.getAnalytics);
router.get('/users', AdminController.getUsers);
router.put('/users/:id/toggle', AdminController.toggleUserStatus);
router.get('/inventory', AdminController.getInventory);
router.put('/inventory/:id', AdminController.updateStock);

// Admin Orders Management
router.get('/orders', OrderController.getAllOrders);
router.put('/orders/:id/status', validateRequest(updateOrderStatusSchema), OrderController.updateStatus);

export default router;
