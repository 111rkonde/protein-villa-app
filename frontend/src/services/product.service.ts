import api from './api';
import { Product, Category, Brand, Review } from '../types';

export const productService = {
  async getProducts(params?: Record<string, any>) {
    const res = await api.get('/products', { params });
    return res.data;
  },

  async getProduct(idOrSlug: string): Promise<Product> {
    const res = await api.get(`/products/${idOrSlug}`);
    return res.data.data;
  },

  async getCategories(): Promise<Category[]> {
    const res = await api.get('/categories');
    return res.data.data;
  },

  async getBrands(): Promise<Brand[]> {
    const res = await api.get('/brands');
    return res.data.data;
  },

  async getRecommendations(goal?: string, limit?: number): Promise<Product[]> {
    const res = await api.get('/products/recommendations', { params: { goal, limit } });
    return res.data.data;
  },

  async compareProducts(ids: string[]): Promise<Product[]> {
    const res = await api.post('/products/compare', { ids });
    return res.data.data;
  },

  async getReviews(productId: string): Promise<{
    reviews: Review[];
    total: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
  }> {
    const res = await api.get(`/reviews/product/${productId}`);
    return res.data.data;
  },

  async addReview(data: { productId: string; rating: number; title?: string; comment: string }) {
    const res = await api.post('/reviews', data);
    return res.data.data;
  },

  // Admin APIs
  async createProduct(data: any): Promise<Product> {
    const res = await api.post('/products', data);
    return res.data.data;
  },

  async updateProduct(id: string, data: any): Promise<Product> {
    const res = await api.put(`/products/${id}`, data);
    return res.data.data;
  },

  async deleteProduct(id: string) {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};
