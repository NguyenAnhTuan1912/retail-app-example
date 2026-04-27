import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { productsApi, type ProductFilters } from './api';

export function useProducts(filters?: ProductFilters, limit = 12) {
  return useInfiniteQuery({
    queryKey: ['products', filters, limit],
    queryFn: ({ pageParam }) => productsApi.list(filters, pageParam, limit),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.get(id),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.getCategories(),
    staleTime: Infinity,
  });
}
