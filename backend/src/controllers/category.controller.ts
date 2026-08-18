import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { sendSuccess, sendError } from '../utils/response';

export class CategoryController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const categories = await CategoryService.getAll();
      sendSuccess(res, categories);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async getBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const category = await CategoryService.getBySlug(slug);
      if (!category) {
        sendError(res, 'Category not found', 404);
        return;
      }
      sendSuccess(res, category);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const category = await CategoryService.create(req.body);
      sendSuccess(res, category, 'Category created.', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await CategoryService.update(id, req.body);
      sendSuccess(res, category, 'Category updated.');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await CategoryService.delete(id);
      sendSuccess(res, null, 'Category deleted.');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
