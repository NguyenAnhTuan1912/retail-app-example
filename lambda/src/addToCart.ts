import { callApiWithBody, successWithData, error } from './shared';

interface Event {
  user?: { userId: string };
  productId: string;
  quantity?: number;
}

export const handler = async (event: Event) => {
  try {
    const items = await callApiWithBody('POST', '/cart', {
      userId: event.user?.userId,
      productId: event.productId,
      quantity: event.quantity ?? 1,
    });

    return successWithData(`Đã thêm vào giỏ hàng. Giỏ hàng hiện có ${items.length} sản phẩm.`, items);
  } catch (e) {
    return error(e);
  }
};
