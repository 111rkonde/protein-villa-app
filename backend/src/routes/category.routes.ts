import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authenticateUser, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.get('/', CategoryController.getAll);
router.get('/:slug', CategoryController.getBySlug);

// Admin Category Management
router.post('/', authenticateUser, authorizeRoles('ADMIN'), CategoryController.create);
router.put('/:id', authenticateUser, authorizeRoles('ADMIN'), CategoryController.update);
router.delete('/:id', authenticateUser, authorizeRoles('ADMIN'), CategoryController.delete);

export default router;
