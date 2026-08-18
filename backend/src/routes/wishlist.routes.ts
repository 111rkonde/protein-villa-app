import { Router } from 'express';
import { WishlistController } from '../controllers/wishlist.controller';
import { authenticateUser } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateUser, WishlistController.getWishlist);
router.post('/toggle', authenticateUser, WishlistController.toggleWishlist);
router.delete('/:productId', authenticateUser, WishlistController.removeFromWishlist);

export default router;
