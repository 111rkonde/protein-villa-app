import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { optionalAuth } from '../middleware/auth.middleware';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

// Rate-limited payment operations
router.post('/create-intent', apiLimiter, optionalAuth, PaymentController.createIntent);
router.post('/verify', apiLimiter, optionalAuth, PaymentController.verifySignature);
router.post('/sandbox-signature', apiLimiter, optionalAuth, PaymentController.generateSandboxSignature);

export default router;
