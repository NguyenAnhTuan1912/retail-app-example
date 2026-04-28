import { callApi, successWithData, error, formatCurrency } from './shared';

interface Event {
  orderId: string;
}

export const handler = async (event: Event) => {
  try {
    const o = await callApi(`/orders/${event.orderId}`);

    const items = o.items
      .map(
        (item: any) =>
          `  - ${item.product.name} x${item.quantity} — ${formatCurrency(item.priceAtPurchase)}/cái`,
      )
      .join('\n');

    const lines = [
      `Đơn hàng: ${o.id}`,
      `Trạng thái: ${o.status.toUpperCase()}`,
      `Tổng tiền: ${formatCurrency(o.totalAmount)}`,
      `Địa chỉ: ${o.shippingAddress}`,
      `Ngày đặt: ${new Date(o.createdAt).toLocaleDateString('vi-VN')}`,
      `Sản phẩm:\n${items}`,
    ];

    if (o.cancellation) {
      lines.push(`Lý do huỷ: ${o.cancellation.reason}`);
      lines.push(
        `Ngày huỷ: ${new Date(o.cancellation.cancelledAt).toLocaleDateString('vi-VN')}`,
      );
    }

    return successWithData(lines.join('\n'), o);
  } catch (e) {
    return error(e);
  }
};
