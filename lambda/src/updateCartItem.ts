import { callApiWithBody, success, error } from './shared';

interface Event {
  apiKey: string;
  itemId: string;
  quantity: number;
}

export const handler = async (event: Event) => {
  try {
    const items = await callApiWithBody(event.apiKey, 'PATCH', `/cart/${event.itemId}`, {
      quantity: event.quantity,
    });

    return success(`Đã cập nhật giỏ hàng. Giỏ hàng hiện có ${items.length} sản phẩm.`);
  } catch (e) {
    return error(e);
  }
};
