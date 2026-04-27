import { callApi, success, error } from './shared';

interface Event {
  apiKey: string;
}

export const handler = async (event: Event) => {
  try {
    const cats = await callApi(event.apiKey, '/products/categories');

    const parents = cats.filter((c: any) => !c.parentId);
    const lines = parents.map((p: any) => {
      const children = cats.filter((c: any) => c.parentId === p.id);
      const childList = children.map((c: any) => `  - ${c.name} (id: ${c.id})`).join('\n');
      return `📁 ${p.name}:\n${childList}`;
    });

    return success(`Danh mục sản phẩm:\n\n${lines.join('\n\n')}`);
  } catch (e) {
    return error(e);
  }
};
