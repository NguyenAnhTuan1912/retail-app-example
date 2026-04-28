import { callApiWithBody, successWithData, error } from './shared';

interface Event {
  user?: { userId: string };
  itemId: string;
}

export const handler = async (event: Event) => {
  try {
    const items = await callApiWithBody('DELETE', `/cart/${event.itemId}`, {
      userId: event.user?.userId,
    });

    return successWithData(`Đã xoá khỏi giỏ hàng. Giỏ hàng hiện có ${items.length} sản phẩm.`, items);
  } catch (e) {
    return error(e);
  }
};
