import { Request, Response } from 'express';
import { GatewayPluginService } from '../services/gateway-plugin.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

export class GatewayPluginController {
  static async getAllPlugins(req: AuthRequest, res: Response): Promise<void> {
    try {
      const plugins = GatewayPluginService.getAllPlugins();
      sendSuccess(res, plugins);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async getActivePlugin(req: Request, res: Response): Promise<void> {
    try {
      const active = GatewayPluginService.getActivePlugin();
      sendSuccess(res, active);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async activatePlugin(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const activated = GatewayPluginService.activatePlugin(id);
      sendSuccess(res, activated, `${activated.name} activated as default payment gateway!`);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async updatePlugin(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = GatewayPluginService.updatePlugin(id, req.body);
      sendSuccess(res, updated, `${updated.name} configuration updated successfully.`);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async testPlugin(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await GatewayPluginService.testPluginConnection(id);
      sendSuccess(res, result);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async generateGatewayQr(req: Request, res: Response): Promise<void> {
    try {
      const amount = Number(req.body.amount || 2999);
      const orderNumber = req.body.orderNumber;
      const qrData = await GatewayPluginService.generateSignedCheckoutQr(amount, orderNumber);
      sendSuccess(res, qrData);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const { utrNumber, amount, sessionId } = req.body;
      if (!utrNumber) {
        sendError(res, 'UTR / Transaction Reference Number is required.', 400);
        return;
      }
      const verified = GatewayPluginService.verifyPayment({
        utrNumber,
        amount: Number(amount || 0),
        sessionId,
      });
      sendSuccess(res, verified, 'Transaction verified on banking ledger.');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
