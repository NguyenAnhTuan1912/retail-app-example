import { callApi, successWithData, error, formatCurrency } from './shared';

interface Event {
  productId: string;
}

export const handler = async (event: Event) => {
  try {
    const p = await callApi(`/products/${event.productId}`);

    const text = [
      `Sản phẩm: ${p.name}`,
      `Giá: ${formatCurrency(p.basePrice)}`,
      `Đánh giá: ⭐${p.ratingAvg}`,
      `Tồn kho: ${p.stockQuantity}`,
      `Danh mục: ${p.category?.name || 'Không có'}`,
      `Người bán: ${p.seller?.fullName || p.seller?.username}`,
      `Mô tả: ${p.description || 'Không có'}`,
    ].join('\n');

    return successWithData(text, p);
  } catch (e) {
    return error(e);
  }
};
