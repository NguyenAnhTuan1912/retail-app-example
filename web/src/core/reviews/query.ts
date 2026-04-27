import { useInfiniteQuery } from '@tanstack/react-query';
import { reviewsApi } from './api';

export function useReviews(productId: string, limit = 10) {
  return useInfiniteQuery({
    queryKey: ['reviews', productId, limit],
    queryFn: ({ pageParam }) => reviewsApi.list(productId, pageParam, limit),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}
