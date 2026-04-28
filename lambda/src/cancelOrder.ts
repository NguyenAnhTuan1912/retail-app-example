import { callApiWithBody, successWithData, error, formatCurrency } from './shared';

interface Event {
  orderId: string;
  reason: string;
}

export const handler = async (event: Event) => {
  try {
    const o = await callApiWithBody('DELETE', `/orders/${event.orderId}`, {
      reason: event.reason,
    });

    const text = [
      `Đã huỷ đơn hàng thành công.`,
      `Đơn hàng: ${o.id}`,
      `Trạng thái: ${o.status.toUpperCase()}`,
      `Tổng tiền: ${formatCurrency(o.totalAmount)}`,
      `Lý do huỷ: ${event.reason}`,
    ].join('\n');

    return successWithData(text, o);
  } catch (e) {
    return error(e);
  }
};
