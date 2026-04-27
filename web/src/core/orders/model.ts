export type TOrderSummary = {
  id: string;
  totalAmount: string;
  status: string;
  createdAt: string;
}

export type TOrderDetail = {
  id: string;
  buyerId: string;
  totalAmount: string;
  status: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    quantity: number;
    priceAtPurchase: string;
    product: { id: string; name: string; basePrice: string };
  }[];
  cancellation: { reason: string; cancelledAt: string } | null;
}

export type TOrderListResponse = {
  data: TOrderSummary[];
  nextCursor: string | null;
}

export const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ xử lý',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã huỷ',
};
