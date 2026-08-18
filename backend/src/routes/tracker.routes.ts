import { Router } from 'express';
import { TrackerController } from '../controllers/tracker.controller';
import { authenticateUser } from '../middleware/auth.middleware';

const router = Router();

router.get('/daily', authenticateUser, TrackerController.getTracker);
router.post('/log', authenticateUser, TrackerController.logProtein);
router.post('/goal', authenticateUser, TrackerController.saveGoal);
router.delete('/log/:id', authenticateUser, TrackerController.deleteLog);

export default router;
