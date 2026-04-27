export type TCartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    basePrice: string;
    stockQuantity: number;
    mainImageUrl: string | null;
  };
}
