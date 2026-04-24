import { callApi, success, error } from './shared';

interface Event {
  productId: string;
  limit?: number;
  cursor?: string;
}

export const handler = async (event: Event) => {
  try {
    const params = new URLSearchParams({ productId: event.productId });
    if (event.limit) params.set('limit', String(event.limit));
    if (event.cursor) params.set('cursor', event.cursor);

    const data = await callApi(`/reviews?${params}`);

    if (!data.data.length)
      return success('Chưa có đánh giá nào cho sản phẩm này.');

    const lines = data.data.map(
      (r: any, i: number) =>
        `${i + 1}. ⭐${r.rating} — ${r.user.fullName || r.user.username}\n   "${r.comment || 'Không có bình luận'}"\n   ${new Date(r.createdAt).toLocaleDateString('vi-VN')}`,
    );

    let result = `Đánh giá sản phẩm (${data.data.length} kết quả):\n\n${lines.join('\n\n')}`;
    if (data.nextCursor)
      result += `\n\n[Trang tiếp: cursor=${data.nextCursor}]`;

    return success(result);
  } catch (e) {
    return error(e);
  }
};
