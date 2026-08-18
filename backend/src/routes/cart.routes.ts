import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuth, CartController.getCart);
router.post('/items', optionalAuth, CartController.addItem);
router.put('/items/:id', optionalAuth, CartController.updateQuantity);
router.delete('/items/:id', optionalAuth, CartController.removeItem);
router.post('/clear', optionalAuth, CartController.clearCart);

export default router;
