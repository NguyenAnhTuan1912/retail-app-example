import { callApi, success, error, formatCurrency } from './shared';

interface Event {
  apiKey: string;
}

export const handler = async (event: Event) => {
  try {
    const items = await callApi(event.apiKey, '/cart');

    if (items.length === 0) return success('Giỏ hàng trống.');

    const lines = items.map(
      (item: any, i: number) =>
        `${i + 1}. ${item.product.name} — ${formatCurrency(item.product.basePrice)} x${item.quantity} = ${formatCurrency(Number(item.product.basePrice) * item.quantity)}`,
    );

    const total = items.reduce(
      (sum: number, item: any) => sum + Number(item.product.basePrice) * item.quantity,
      0,
    );

    return success(
      `🛒 Giỏ hàng (${items.length} sản phẩm):\n\n${lines.join('\n')}\n\nTổng cộng: ${formatCurrency(total)}`,
    );
  } catch (e) {
    return error(e);
  }
};
