const API_KEY = 'buyer1-api-key-demo-retail-2026';

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'X-API-Key': API_KEY },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export interface ProductSummary {
  id: string;
  name: string;
  basePrice: string;
  ratingAvg: string;
  stockQuantity: number;
  mainImageUrl: string | null;
}

export interface ProductDetail {
  id: string;
  name: string;
  description: string;
  basePrice: string;
  ratingAvg: string;
  stockQuantity: number;
  seller: { fullName: string };
  category: { name: string } | null;
  images: { url: string; isMain: boolean }[];
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { fullName: string };
}

export const api = {
  getProducts: (cursor?: string, limit = 12) => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (cursor) params.set('cursor', cursor);
    return request<{ data: ProductSummary[]; nextCursor: string | null }>(
      `/products?${params}`,
    );
  },

  getProduct: (id: string) => request<ProductDetail>(`/products/${id}`),

  getReviews: (productId: string, cursor?: string, limit = 10) => {
    const params = new URLSearchParams({ productId, limit: String(limit) });
    if (cursor) params.set('cursor', cursor);
    return request<{ data: Review[]; nextCursor: string | null }>(
      `/reviews?${params}`,
    );
  },
};
