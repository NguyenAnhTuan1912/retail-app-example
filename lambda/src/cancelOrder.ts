import { callApiWithBody, success, error, formatCurrency } from './shared';

interface Event {
  orderId: string;
  reason: string;
}

export const handler = async (event: Event) => {
  try {
    const o = await callApiWithBody('DELETE', `/orders/${event.orderId}`, {
      reason: event.reason,
    });

    const result = [
      `Đã huỷ đơn hàng thành công.`,
      `Đơn hàng: ${o.id}`,
      `Trạng thái: ${o.status.toUpperCase()}`,
      `Tổng tiền: ${formatCurrency(o.totalAmount)}`,
      `Lý do huỷ: ${event.reason}`,
    ].join('\n');

    return success(result);
  } catch (e) {
    return error(e);
  }
};
