import { successWithData, error } from './shared';

const VALID_COMPONENTS = [
  "order-detail-chat-view",
  "reviews-chat-view",
  "cart-detail-chat-view",
  "product-detail-chat-view",
] as const;

interface Event {
  componentName: string;
  props: any;
}

export const handler = async (event: Event) => {
  try {
    if (!VALID_COMPONENTS.includes(event.componentName as any)) {
      return error(`Invalid component: ${event.componentName}. Valid: ${VALID_COMPONENTS.join(', ')}`);
    }

    return successWithData(`Render ${event.componentName}`, {
      componentName: event.componentName,
      props: event.props,
    });
  } catch (e) {
    return error(e);
  }
};
