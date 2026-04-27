import { callApiWithBody, success, error } from './shared';

interface Event {
  productId: string;
  quantity?: number;
}

export const handler = async (event: Event) => {
  try {
    const items = await callApiWithBody('POST', '/cart', {
      productId: event.productId,
      quantity: event.quantity ?? 1,
    });

    return success(`Đã thêm vào giỏ hàng. Giỏ hàng hiện có ${items.length} sản phẩm.`);
  } catch (e) {
    return error(e);
  }
};
