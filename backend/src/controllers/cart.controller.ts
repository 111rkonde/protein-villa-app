import { Response } from 'express';
import { CartService } from '../services/cart.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

export class CartController {
  static async getCart(req: AuthRequest, res: Response): Promise<void> {
    try {
      const sessionId = (req.headers['x-session-id'] as string) || (req.query.sessionId as string);
      const cart = await CartService.getOrCreateCart(req.user?.userId, sessionId);
      sendSuccess(res, cart);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async addItem(req: AuthRequest, res: Response): Promise<void> {
    try {
      const sessionId = (req.headers['x-session-id'] as string) || req.body.sessionId;
      const { productId, size, flavor, quantity } = req.body;

      const cart = await CartService.addItem(
        { userId: req.user?.userId, sessionId },
        { productId, size, flavor, quantity }
      );
      sendSuccess(res, cart, 'Item added to cart.');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async updateQuantity(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity, sessionId } = req.body;
      const effectiveSession = (req.headers['x-session-id'] as string) || sessionId;

      const cart = await CartService.updateItemQuantity(
        { userId: req.user?.userId, sessionId: effectiveSession },
        id,
        quantity
      );
      sendSuccess(res, cart, 'Cart updated.');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async removeItem(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const sessionId = (req.headers['x-session-id'] as string) || (req.query.sessionId as string);
      const result = await CartService.removeItem(
        { userId: req.user?.userId, sessionId },
        id
      );
      sendSuccess(res, result, 'Item removed from cart.');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async clearCart(req: AuthRequest, res: Response): Promise<void> {
    try {
      const sessionId = (req.headers['x-session-id'] as string) || (req.query.sessionId as string);
      const result = await CartService.clearCart({
        userId: req.user?.userId,
        sessionId,
      });
      sendSuccess(res, result, 'Cart cleared successfully.');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
