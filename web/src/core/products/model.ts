export type TProductSummary = {
  id: string;
  name: string;
  basePrice: string;
  ratingAvg: string;
  stockQuantity: number;
  mainImageUrl: string | null;
}

export type TProductDetail = {
  id: string;
  name: string;
  description: string;
  basePrice: string;
  ratingAvg: string;
  stockQuantity: number;
  seller: { fullName: string };
  category: { name: string } | null;
  images: { url: string; isMain: boolean }[];
  reviewCount: number;
}

export type TProductListResponse = {
  data: TProductSummary[];
  nextCursor: string | null;
}

export type TCategory = {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
}
