import { Router } from 'express';
import { BrandController } from '../controllers/brand.controller';
import { authenticateUser, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.get('/', BrandController.getAll);

// Admin Brand Management
router.post('/', authenticateUser, authorizeRoles('ADMIN'), BrandController.create);
router.put('/:id', authenticateUser, authorizeRoles('ADMIN'), BrandController.update);
router.delete('/:id', authenticateUser, authorizeRoles('ADMIN'), BrandController.delete);

export default router;
