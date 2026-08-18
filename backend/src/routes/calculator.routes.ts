import { Router } from 'express';
import { CalculatorController } from '../controllers/calculator.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { proteinCalcSchema, fitnessMetricsSchema } from '../validators/calculator.validator';

const router = Router();

router.post('/protein', validateRequest(proteinCalcSchema), CalculatorController.calculateProtein);
router.post('/fitness', validateRequest(fitnessMetricsSchema), CalculatorController.calculateFitnessMetrics);
router.post('/bmi', validateRequest(fitnessMetricsSchema), CalculatorController.calculateFitnessMetrics);
router.post('/bmr', validateRequest(fitnessMetricsSchema), CalculatorController.calculateFitnessMetrics);
router.post('/tdee', validateRequest(fitnessMetricsSchema), CalculatorController.calculateFitnessMetrics);

export default router;
