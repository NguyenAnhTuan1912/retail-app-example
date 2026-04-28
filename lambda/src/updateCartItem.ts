import { callApiWithBody, successWithData, error } from './shared';

interface Event {
  user?: { userId: string };
  itemId: string;
  quantity: number;
}

export const handler = async (event: Event) => {
  try {
    const items = await callApiWithBody('PATCH', `/cart/${event.itemId}`, {
      userId: event.user?.userId,
      quantity: event.quantity,
    });

    return successWithData(`Đã cập nhật giỏ hàng. Giỏ hàng hiện có ${items.length} sản phẩm.`, items);
  } catch (e) {
    return error(e);
  }
};
