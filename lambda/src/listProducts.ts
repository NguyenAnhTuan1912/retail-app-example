import { callApi, success, error, formatCurrency } from './shared';

interface Event {
  limit?: number;
  cursor?: string;
  search?: string;
  categoryId?: number;
  priceFrom?: number;
  priceTo?: number;
}

export const handler = async (event: Event) => {
  try {
    const params = new URLSearchParams();
    if (event.limit) params.set('limit', String(event.limit));
    if (event.cursor) params.set('cursor', event.cursor);
    if (event.search) params.set('search', event.search);
    if (event.categoryId) params.set('categoryId', String(event.categoryId));
    if (event.priceFrom !== undefined) params.set('priceFrom', String(event.priceFrom));
    if (event.priceTo !== undefined) params.set('priceTo', String(event.priceTo));

    const qs = params.toString();
    const data = await callApi(`/products${qs ? `?${qs}` : ''}`);

    const lines = data.data.map(
      (p: any, i: number) =>
        `${i + 1}. ${p.name} — ${formatCurrency(p.basePrice)} | ⭐${p.ratingAvg} | Kho: ${p.stockQuantity}`,
    );

    let result = `Danh sách sản phẩm (${data.data.length} kết quả):\n\n${lines.join('\n')}`;
    if (data.nextCursor)
      result += `\n\n[Trang tiếp: cursor=${data.nextCursor}]`;

    return success(result);
  } catch (e) {
    return error(e);
  }
};
