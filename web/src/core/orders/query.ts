import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ordersApi } from './api';

export function useOrders(userId?: string, limit = 10) {
  return useInfiniteQuery({
    queryKey: ['orders', userId, limit],
    queryFn: ({ pageParam }) => ordersApi.list(userId!, pageParam, limit),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    enabled: !!userId,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.get(id),
  });
}
