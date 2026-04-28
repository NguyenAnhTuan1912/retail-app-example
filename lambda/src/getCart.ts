import { callApi, successWithData, error, formatCurrency } from './shared';

interface Event {
  user?: { userId: string };
}

export const handler = async (event: Event) => {
  try {
    const qs = event.user?.userId ? `?userId=${event.user.userId}` : '';
    const items = await callApi(`/cart${qs}`);

    if (items.length === 0) return successWithData('Giỏ hàng trống.', []);

    const lines = items.map(
      (item: any, i: number) =>
        `${i + 1}. ${item.product.name} — ${formatCurrency(item.product.basePrice)} x${item.quantity} = ${formatCurrency(Number(item.product.basePrice) * item.quantity)}`,
    );

    const total = items.reduce(
      (sum: number, item: any) => sum + Number(item.product.basePrice) * item.quantity,
      0,
    );

    const text = `🛒 Giỏ hàng (${items.length} sản phẩm):\n\n${lines.join('\n')}\n\nTổng cộng: ${formatCurrency(total)}`;

    return successWithData(text, items);
  } catch (e) {
    return error(e);
  }
};
