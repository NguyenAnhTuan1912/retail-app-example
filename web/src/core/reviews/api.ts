import { request } from '../api';
import type { TReviewListResponse } from './model';

export const reviewsApi = {
  list: (productId: string, cursor?: string, limit = 10) => {
    const params = new URLSearchParams({ productId, limit: String(limit) });
    if (cursor) params.set('cursor', cursor);
    return request<TReviewListResponse>(`/reviews?${params}`);
  },
};
