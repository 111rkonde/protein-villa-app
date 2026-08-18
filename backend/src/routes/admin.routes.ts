import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticateUser, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

// Protect ALL admin routes with authenticateUser + authorizeRoles('ADMIN')
router.use(authenticateUser, authorizeRoles('ADMIN'));

router.get('/analytics', AdminController.getAnalytics);
router.get('/users', AdminController.getUsers);
router.put('/users/:id/toggle', AdminController.toggleUserStatus);
router.get('/inventory', AdminController.getInventory);
router.put('/inventory/:id', AdminController.updateStock);

export default router;
