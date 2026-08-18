import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticateUser, authorizeRoles } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createProductSchema, updateProductSchema } from '../validators/product.validator';

const router = Router();

router.get('/', ProductController.getProducts);
router.get('/recommendations', ProductController.getRecommendations);
router.post('/compare', ProductController.compareProducts);
router.get('/:id', ProductController.getProductByIdOrSlug);

// Protected Admin Routes
router.post(
  '/',
  authenticateUser,
  authorizeRoles('ADMIN'),
  validateRequest(createProductSchema),
  ProductController.createProduct
);
router.put(
  '/:id',
  authenticateUser,
  authorizeRoles('ADMIN'),
  validateRequest(updateProductSchema),
  ProductController.updateProduct
);
router.delete(
  '/:id',
  authenticateUser,
  authorizeRoles('ADMIN'),
  ProductController.deleteProduct
);

export default router;
