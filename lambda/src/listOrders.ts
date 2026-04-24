import { callApi, success, error, formatCurrency } from './shared';

interface Event {
  userId: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  limit?: number;
  cursor?: string;
}

export const handler = async (event: Event) => {
  try {
    const params = new URLSearchParams({ userId: event.userId });
    if (event.dateFrom) params.set('dateFrom', event.dateFrom);
    if (event.dateTo) params.set('dateTo', event.dateTo);
    if (event.search) params.set('search', event.search);
    if (event.limit) params.set('limit', String(event.limit));
    if (event.cursor) params.set('cursor', event.cursor);

    const data = await callApi(`/orders?${params}`);

    if (!data.data.length) return success('Không tìm thấy đơn hàng nào.');

    const lines = data.data.map(
      (o: any, i: number) =>
        `${i + 1}. [${o.status.toUpperCase()}] ${formatCurrency(o.totalAmount)} — ${new Date(o.createdAt).toLocaleDateString('vi-VN')} (ID: ${o.id})`,
    );

    let result = `Đơn hàng (${data.data.length} kết quả):\n\n${lines.join('\n')}`;
    if (data.nextCursor)
      result += `\n\n[Trang tiếp: cursor=${data.nextCursor}]`;

    return success(result);
  } catch (e) {
    return error(e);
  }
};
