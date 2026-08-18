import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { sendSuccess, sendError, sendPagination } from '../utils/response';
import { AuthRequest } from '../types';

export class ProductController {
  static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const { search, category, brand, minPrice, maxPrice, minProtein, goal, rating, inStock, isFeatured, isBestSeller, sortBy, page, limit } = req.query;

      const result = await ProductService.getProducts({
        search: search as string,
        category: category as string,
        brand: brand as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minProtein: minProtein ? Number(minProtein) : undefined,
        goal: goal as string,
        rating: rating ? Number(rating) : undefined,
        inStock: inStock === 'true',
        isFeatured: isFeatured ? isFeatured === 'true' : undefined,
        isBestSeller: isBestSeller ? isBestSeller === 'true' : undefined,
        sortBy: sortBy as any,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 12,
      });

      sendPagination(res, result.products, result.total, result.page, result.limit);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async getProductByIdOrSlug(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductByIdOrSlug(id);
      sendSuccess(res, product);
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }

  static async createProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      const product = await ProductService.createProduct(req.body, req.user?.userId);
      sendSuccess(res, product, 'Product created successfully.', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async updateProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await ProductService.updateProduct(id, req.body, req.user?.userId);
      sendSuccess(res, product, 'Product updated successfully.');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async deleteProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await ProductService.deleteProduct(id, req.user?.userId);
      sendSuccess(res, result, 'Product deleted successfully.');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  static async getRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const { goal, limit } = req.query;
      const recommendations = await ProductService.getRecommendations(
        goal as string,
        limit ? Number(limit) : 4
      );
      sendSuccess(res, recommendations);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  static async compareProducts(req: Request, res: Response): Promise<void> {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        sendError(res, 'Please provide an array of product IDs to compare.', 400);
        return;
      }
      const compared = await ProductService.compareProducts(ids.slice(0, 4));
      sendSuccess(res, compared);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
