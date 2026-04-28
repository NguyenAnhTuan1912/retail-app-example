import { callApi, successWithData, error, formatCurrency } from './shared';

interface Event {
  user?: { userId: string };
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  limit?: number;
  cursor?: string;
}

export const handler = async (event: Event) => {
  try {
    const params = new URLSearchParams();
    if (event.user?.userId) params.set('userId', event.user.userId);
    if (event.dateFrom) params.set('dateFrom', event.dateFrom);
    if (event.dateTo) params.set('dateTo', event.dateTo);
    if (event.search) params.set('search', event.search);
    if (event.limit) params.set('limit', String(event.limit));
    if (event.cursor) params.set('cursor', event.cursor);

    const data = await callApi(`/orders?${params}`);

    if (!data.data.length) return successWithData('Không tìm thấy đơn hàng nào.', data);

    const lines = data.data.map(
      (o: any, i: number) =>
        `${i + 1}. [${o.status.toUpperCase()}] ${formatCurrency(o.totalAmount)} — ${new Date(o.createdAt).toLocaleDateString('vi-VN')} (ID: ${o.id})`,
    );

    let text = `Đơn hàng (${data.data.length} kết quả):\n\n${lines.join('\n')}`;
    if (data.nextCursor)
      text += `\n\n[Trang tiếp: cursor=${data.nextCursor}]`;

    return successWithData(text, data);
  } catch (e) {
    return error(e);
  }
};
