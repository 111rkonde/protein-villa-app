import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createReviewSchema } from '../validators/review.validator';

const router = Router();

router.get('/product/:productId', ReviewController.getProductReviews);
router.post('/', authenticateUser, validateRequest(createReviewSchema), ReviewController.addReview);
router.delete('/:id', authenticateUser, ReviewController.deleteReview);

export default router;
