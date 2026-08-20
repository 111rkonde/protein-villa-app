import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { GatewayPluginController } from '../controllers/gateway-plugin.controller';
import { BankController } from '../controllers/bank.controller';
import { optionalAuth } from '../middleware/auth.middleware';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public active bank & active gateway for checkout QR routing
router.get('/active-bank', BankController.getActiveBank);
router.get('/active-gateway', GatewayPluginController.getActivePlugin);
router.post('/gateway-qr/generate', apiLimiter, GatewayPluginController.generateGatewayQr);
router.post('/gateway-qr/verify', apiLimiter, GatewayPluginController.verifyPayment);

// Rate-limited payment operations
router.post('/create-intent', apiLimiter, optionalAuth, PaymentController.createIntent);
router.post('/verify', apiLimiter, optionalAuth, PaymentController.verifySignature);
router.post('/sandbox-signature', apiLimiter, optionalAuth, PaymentController.generateSandboxSignature);

export default router;
