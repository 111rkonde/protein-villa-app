import { Response } from 'express';
import { AdminService } from '../services/admin.service';
import { sendSuccess, sendError, sendPagination } from '../utils/response';
import { AuthRequest } from '../types';

export class AdminController {
  static async getAnalytics(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await AdminService.getDashboardAnalytics();
      sendSuccess(res, data);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async getUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { search, page, limit } = req.query;
      const result = await AdminService.getUsers({
        search: search as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });
      sendPagination(res, result.users, result.total, result.page, result.limit);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async toggleUserStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await AdminService.toggleUserStatus(id, req.user?.userId);
      sendSuccess(res, updated, 'User status updated.');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async getInventory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const inventory = await AdminService.getInventory();
      sendSuccess(res, inventory);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async updateStock(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity, note } = req.body;
      const result = await AdminService.updateStock(id, quantity, note, req.user?.userId);
      sendSuccess(res, result, 'Stock updated successfully.');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
