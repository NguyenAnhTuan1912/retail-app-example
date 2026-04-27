import { callApiWithBody, success, error } from './shared';

interface Event {
  itemId: string;
  quantity: number;
}

export const handler = async (event: Event) => {
  try {
    const items = await callApiWithBody('PATCH', `/cart/${event.itemId}`, {
      quantity: event.quantity,
    });

    return success(`Đã cập nhật giỏ hàng. Giỏ hàng hiện có ${items.length} sản phẩm.`);
  } catch (e) {
    return error(e);
  }
};
