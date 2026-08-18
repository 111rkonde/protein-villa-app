import { Request, Response } from 'express';
import { VerifyService } from '../services/verify.service';
import { sendSuccess, sendError } from '../utils/response';

export class VerifyController {
  static async verifyCode(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.params;
      if (!code) {
        sendError(res, 'Verification code is required.', 400);
        return;
      }
      const result = await VerifyService.verifyCode(code);
      sendSuccess(res, result);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }
}
