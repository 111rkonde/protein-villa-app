import { Response } from 'express';
import { WishlistService } from '../services/wishlist.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

export class WishlistController {
  static async getWishlist(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const wishlist = await WishlistService.getWishlist(req.user.userId);
      sendSuccess(res, wishlist);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async toggleWishlist(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const { productId } = req.body;
      const result = await WishlistService.toggleWishlist(req.user.userId, productId);
      sendSuccess(res, result, result.message);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async removeFromWishlist(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const { productId } = req.params;
      const result = await WishlistService.removeFromWishlist(req.user.userId, productId);
      sendSuccess(res, result);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
