import { Router } from 'express';
import { VerifyController } from '../controllers/verify.controller';

const router = Router();

router.get('/:code', VerifyController.verifyCode);

export default router;
