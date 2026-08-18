import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { sendSuccess, sendError, sendPagination } from '../utils/response';
import { AuthRequest } from '../types';

export class OrderController {
  static async createOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const order = await OrderService.createOrder({
        ...req.body,
        userId: req.user?.userId,
      });
      sendSuccess(res, order, 'Order placed successfully!', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async getMyOrders(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const orders = await OrderService.getUserOrders(req.user.userId);
      sendSuccess(res, orders);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async getOrderById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id);

      // Check authorization (must be user who placed it or admin)
      if (req.user?.role !== 'ADMIN' && order.userId && order.userId !== req.user?.userId) {
        sendError(res, 'Forbidden. You do not have access to this order.', 403);
        return;
      }

      sendSuccess(res, order);
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }

  static async trackOrder(req: Request, res: Response): Promise<void> {
    try {
      const { orderNumber } = req.params;
      const tracking = await OrderService.trackOrderByNumber(orderNumber);
      sendSuccess(res, tracking);
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }

  static async getAllOrders(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { status, search, page, limit } = req.query;
      const result = await OrderService.getAllOrders({
        status: status as string,
        search: search as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 15,
      });
      sendPagination(res, result.orders, result.total, result.page, result.limit);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async updateStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, trackingNumber, estimatedDelivery } = req.body;
      const updated = await OrderService.updateOrderStatus(
        id,
        status,
        trackingNumber,
        estimatedDelivery,
        req.user?.userId
      );
      sendSuccess(res, updated, `Order status updated to ${status}.`);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
