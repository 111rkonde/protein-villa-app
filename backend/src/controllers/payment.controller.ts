import { Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

export class PaymentController {
  static async createIntent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { amount, currency, orderNumber, paymentMethod } = req.body;
      if (!amount || !orderNumber) {
        sendError(res, 'Amount and orderNumber are required.', 400);
        return;
      }

      const intent = PaymentService.createPaymentIntent({
        amount: Number(amount),
        currency: currency || 'INR',
        orderNumber,
        paymentMethod: paymentMethod || 'CARD',
        userId: req.user?.userId,
      });

      sendSuccess(res, intent, 'Payment intent created successfully.', 201);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async verifySignature(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { gatewayOrderId, gatewayPaymentId, gatewaySignature } = req.body;
      if (!gatewayOrderId || !gatewayPaymentId || !gatewaySignature) {
        sendError(res, 'Missing gateway transaction or signature parameters.', 400);
        return;
      }

      const isValid = PaymentService.verifyPaymentSignature({
        gatewayOrderId,
        gatewayPaymentId,
        gatewaySignature,
      });

      if (!isValid) {
        sendError(res, 'Invalid payment signature. Transaction verification failed.', 400);
        return;
      }

      sendSuccess(res, { verified: true }, 'Payment signature verified successfully.');
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async generateSandboxSignature(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { gatewayOrderId } = req.body;
      if (!gatewayOrderId) {
        sendError(res, 'gatewayOrderId is required.', 400);
        return;
      }

      const sandboxData = PaymentService.generateSandboxPaymentSignature(gatewayOrderId);
      sendSuccess(res, sandboxData, 'Sandbox payment credentials generated.');
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }
}
