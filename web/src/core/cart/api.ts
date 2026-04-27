import { request, mutate } from '../api';
import type { TCartItem } from './model';

export const cartApi = {
  get: () => request<TCartItem[]>('/cart'),
  add: (productId: string, quantity = 1) =>
    mutate<TCartItem[]>('/cart', 'POST', { productId, quantity }),
  update: (itemId: string, quantity: number) =>
    mutate<TCartItem[]>(`/cart/${itemId}`, 'PATCH', { quantity }),
  remove: (itemId: string) =>
    mutate<TCartItem[]>(`/cart/${itemId}`, 'DELETE'),
};
