import { Request, Response } from 'express';
import { CalculatorService } from '../services/calculator.service';
import { sendSuccess, sendError } from '../utils/response';

export class CalculatorController {
  static calculateProtein(req: Request, res: Response): void {
    try {
      const result = CalculatorService.calculateProtein(req.body);
      sendSuccess(res, result);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static calculateFitnessMetrics(req: Request, res: Response): void {
    try {
      const result = CalculatorService.calculateFitnessMetrics(req.body);
      sendSuccess(res, result);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
