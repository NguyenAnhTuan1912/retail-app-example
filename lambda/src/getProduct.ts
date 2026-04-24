import { callApi, success, error, formatCurrency } from './shared';

interface Event {
  productId: string;
}

export const handler = async (event: Event) => {
  try {
    const p = await callApi(`/products/${event.productId}`);

    const images =
      p.images
        ?.map((img: any) => `  - ${img.url}${img.isMain ? ' (ảnh chính)' : ''}`)
        .join('\n') || '  Không có';

    const result = [
      `Sản phẩm: ${p.name}`,
      `Giá: ${formatCurrency(p.basePrice)}`,
      `Đánh giá: ⭐${p.ratingAvg}`,
      `Tồn kho: ${p.stockQuantity}`,
      `Danh mục: ${p.category?.name || 'Không có'}`,
      `Người bán: ${p.seller?.fullName || p.seller?.username}`,
      `Mô tả: ${p.description || 'Không có'}`,
      `Hình ảnh:\n${images}`,
      `Ngày đăng: ${new Date(p.createdAt).toLocaleDateString('vi-VN')}`,
    ].join('\n');

    return success(result);
  } catch (e) {
    return error(e);
  }
};
