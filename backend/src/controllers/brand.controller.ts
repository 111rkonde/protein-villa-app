import { Request, Response } from 'express';
import { BrandService } from '../services/brand.service';
import { sendSuccess, sendError } from '../utils/response';

export class BrandController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const brands = await BrandService.getAll();
      sendSuccess(res, brands);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const brand = await BrandService.create(req.body);
      sendSuccess(res, brand, 'Brand created.', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const brand = await BrandService.update(id, req.body);
      sendSuccess(res, brand, 'Brand updated.');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await BrandService.delete(id);
      sendSuccess(res, null, 'Brand deleted.');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
