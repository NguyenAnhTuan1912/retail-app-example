import { callApi, successWithData, error } from './shared';

export const handler = async () => {
  try {
    const cats = await callApi('/products/categories');

    const parents = cats.filter((c: any) => !c.parentId);
    const lines = parents.map((p: any) => {
      const children = cats.filter((c: any) => c.parentId === p.id);
      const childList = children.map((c: any) => `  - ${c.name} (id: ${c.id})`).join('\n');
      return `📁 ${p.name}:\n${childList}`;
    });

    return successWithData(`Danh mục sản phẩm:\n\n${lines.join('\n\n')}`, cats);
  } catch (e) {
    return error(e);
  }
};
