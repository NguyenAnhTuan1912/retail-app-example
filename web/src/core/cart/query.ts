import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from './api';

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.get(),
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity?: number }) =>
      cartApi.add(productId, quantity),
    onSuccess: (data) => qc.setQueryData(['cart'], data),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.update(itemId, quantity),
    onSuccess: (data) => qc.setQueryData(['cart'], data),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => cartApi.remove(itemId),
    onSuccess: (data) => qc.setQueryData(['cart'], data),
  });
}
