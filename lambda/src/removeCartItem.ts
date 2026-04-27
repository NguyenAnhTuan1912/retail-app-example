import { callApiWithBody, success, error } from './shared';

interface Event {
  itemId: string;
}

export const handler = async (event: Event) => {
  try {
    const items = await callApiWithBody('DELETE', `/cart/${event.itemId}`, {});

    return success(`Đã xoá khỏi giỏ hàng. Giỏ hàng hiện có ${items.length} sản phẩm.`);
  } catch (e) {
    return error(e);
  }
};
