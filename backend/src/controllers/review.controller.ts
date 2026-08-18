import { Request, Response } from 'express';
import { ReviewService } from '../services/review.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

export class ReviewController {
  static async getProductReviews(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const result = await ReviewService.getProductReviews(productId);
      sendSuccess(res, result);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async addReview(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const review = await ReviewService.addReview(
        req.user.userId,
        req.user.name,
        undefined,
        req.body
      );
      sendSuccess(res, review, 'Review submitted successfully!', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async deleteReview(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const isAdmin = req.user?.role === 'ADMIN';
      const result = await ReviewService.deleteReview(id, req.user?.userId, isAdmin);
      sendSuccess(res, result);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
