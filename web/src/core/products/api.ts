import { request } from '../api';
import type { TCategory, TProductDetail, TProductListResponse } from './model';

export interface ProductFilters {
  search?: string;
  categoryId?: number;
  priceFrom?: number;
  priceTo?: number;
}

export const productsApi = {
  list: (filters?: ProductFilters, cursor?: string, limit = 12) => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (cursor) params.set('cursor', cursor);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.categoryId) params.set('categoryId', String(filters.categoryId));
    if (filters?.priceFrom !== undefined) params.set('priceFrom', String(filters.priceFrom));
    if (filters?.priceTo !== undefined) params.set('priceTo', String(filters.priceTo));
    return request<TProductListResponse>(`/products?${params}`);
  },

  get: (id: string) => request<TProductDetail>(`/products/${id}`),

  getCategories: () => request<TCategory[]>('/products/categories'),
};
