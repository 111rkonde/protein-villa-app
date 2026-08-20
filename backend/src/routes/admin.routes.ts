import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { OrderController } from '../controllers/order.controller';
import { BankController } from '../controllers/bank.controller';
import { GatewayPluginController } from '../controllers/gateway-plugin.controller';
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

// Bank Accounts & Settlement Priorities Management
router.get('/banks', BankController.getAllBanks);
router.post('/banks', BankController.addBank);
router.put('/banks/:id/primary', BankController.setPrimaryBank);
router.put('/banks/:id', BankController.updateBank);
router.delete('/banks/:id', BankController.deleteBank);

// Payment Gateway Plugins Management
router.get('/gateway-plugins', GatewayPluginController.getAllPlugins);
router.put('/gateway-plugins/:id', GatewayPluginController.updatePlugin);
router.put('/gateway-plugins/:id/activate', GatewayPluginController.activatePlugin);
router.post('/gateway-plugins/:id/test', GatewayPluginController.testPlugin);

export default router;
