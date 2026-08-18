import { Response } from 'express';
import { TrackerService } from '../services/tracker.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

export class TrackerController {
  static async getTracker(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const { date } = req.query;
      const data = await TrackerService.getDailyTracker(req.user.userId, date as string);
      sendSuccess(res, data);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async logProtein(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const log = await TrackerService.logProtein(req.user.userId, req.body);
      sendSuccess(res, log, 'Protein logged successfully!', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async saveGoal(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const goal = await TrackerService.saveProteinGoal(req.user.userId, req.body);
      sendSuccess(res, goal, 'Protein goal saved to profile.');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async deleteLog(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const { id } = req.params;
      await TrackerService.deleteLog(req.user.userId, id);
      sendSuccess(res, null, 'Log entry deleted.');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
