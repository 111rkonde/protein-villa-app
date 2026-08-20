import { Request, Response } from 'express';
import { BankService } from '../services/bank.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

export class BankController {
  static async getAllBanks(req: AuthRequest, res: Response): Promise<void> {
    try {
      const banks = await BankService.getAllBankAccounts();
      sendSuccess(res, banks);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async getActiveBank(req: Request, res: Response): Promise<void> {
    try {
      const activeBank = await BankService.getActivePrimaryBank();
      sendSuccess(res, activeBank);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async addBank(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        bankName,
        accountHolder,
        accountNumber,
        ifscCode,
        upiVpa,
        accountType,
        isPrimary,
        branchName,
      } = req.body;

      if (!bankName || !accountHolder || !accountNumber || !ifscCode) {
        sendError(res, 'Bank Name, Account Holder, Account Number, and IFSC Code are required.', 400);
        return;
      }

      const newBank = await BankService.addBankAccount({
        bankName,
        accountHolder,
        accountNumber,
        ifscCode,
        upiVpa,
        accountType,
        isPrimary,
        branchName,
      });

      sendSuccess(res, newBank, 'Bank account added successfully!', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async setPrimaryBank(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await BankService.setPrimaryBank(id);
      sendSuccess(res, updated, 'Primary settlement bank updated successfully!');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async updateBank(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await BankService.updateBankAccount(id, req.body);
      sendSuccess(res, updated, 'Bank details updated successfully.');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async deleteBank(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await BankService.deleteBankAccount(id);
      sendSuccess(res, result);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
