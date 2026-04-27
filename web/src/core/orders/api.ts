import { request } from '../api';
import type { TOrderDetail, TOrderListResponse } from './model';

export const ordersApi = {
  list: (userId: string, cursor?: string, limit = 10) => {
    const params = new URLSearchParams({
      userId,
      limit: String(limit),
      dateFrom: '2020-01-01',
    });
    if (cursor) params.set('cursor', cursor);
    return request<TOrderListResponse>(`/orders?${params}`);
  },

  get: (id: string) => request<TOrderDetail>(`/orders/${id}`),
};
