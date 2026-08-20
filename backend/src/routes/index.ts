import { Router } from 'express';
import prisma from '../config/db';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import brandRoutes from './brand.routes';
import cartRoutes from './cart.routes';
import wishlistRoutes from './wishlist.routes';
import orderRoutes from './order.routes';
import paymentRoutes from './payment.routes';
import reviewRoutes from './review.routes';
import couponRoutes from './coupon.routes';
import calculatorRoutes from './calculator.routes';
import trackerRoutes from './tracker.routes';
import verifyRoutes from './verify.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/coupons', couponRoutes);
router.use('/calculator', calculatorRoutes);
router.use('/tracker', trackerRoutes);
router.use('/verify', verifyRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint with Database Ping & Telemetry
router.get('/health', async (req, res) => {
  try {
    const dbStartTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatencyMs = Date.now() - dbStartTime;

    res.json({
      status: 'healthy',
      database: {
        status: 'connected',
        latencyMs: `${dbLatencyMs}ms`,
      },
      timestamp: new Date().toISOString(),
      service: 'Protein Villa API',
      version: '1.0.0',
      uptimeSeconds: Math.floor(process.uptime()),
      memory: {
        rssMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
        heapUsedMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      },
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'degraded',
      database: {
        status: 'disconnected',
        error: error.message,
      },
      timestamp: new Date().toISOString(),
      service: 'Protein Villa API',
    });
  }
});

export default router;
