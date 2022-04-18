import { Injectable } from '@nestjs/common';
import { MenuNode, ROOT_MENU_NODE_ID } from '../responses/menu-node';
import { PatchMenuNode } from '../responses/nested-tree-node';

@Injectable()
export class MenuService {
  private nodes: { [key: string]: MenuNode } = {};
  private patches: PatchMenuNode[] = [];

  /**
   * Получит древовидную структуру меню
   * Если меню не найдено, вернет пустой массив
   * Все меню стоится от корня
   * Листовые узлы обязаны иметь ссылку или будут удалены
   */
  getMenu(): MenuNode[] {
    const nodeMap: { [id: string]: MenuNode } = {};
    let src = Object.values(this.nodes).map((node) => {
      const copy = { ...node };
      nodeMap[copy.id] = copy;
      return copy;
    });

    this.patches.forEach((patch) => {
      if (nodeMap[patch.id]) {
        Object.assign(nodeMap[patch.id], patch);
      }
    });

    src = src.filter((node) => !node.removed);

    return this.getMenuForNode(ROOT_MENU_NODE_ID, src);
  }

  private getMenuForNode(id: string, src: MenuNode[]): MenuNode[] {
    return src
      .filter((node) => node.parentId === id)
      .map(({ href, ...node }) => {
        const children = this.getMenuForNode(node.id, src);

        if (children.length > 0) {
          return {
            ...node,
            children,
          };
        }

        return {
          ...node,
          href,
          removed: !href,
          children: [],
        };
      })
      .filter((node) => !node.removed)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  /**
   * Добавить конфигурацию узла меню
   *
   * Дочерние узлы будут связаны с родителем даже если
   *   они имеют свой признак parentId
   */
  add(...nodes: MenuNode[]): void {
    nodes.forEach((node) => {
      const sanitizedChildren =
        node.children?.map((child) => ({
          ...child,
          parentId: node.id,
        })) || [];

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { children, ...sanitizedNode } = node;

      this.add(...sanitizedChildren);

      this.nodes[node.id] = sanitizedNode;
    });
  }

  /**
   * Модифицировать конфигурацию узла меню
   *
   * Древовидная модификация не поддерживается
   */
  patch(...patches: PatchMenuNode[]): void {
    this.patches = [...this.patches, ...patches];
  }

  /**
   * По ID удаляется узел из дерева
   *
   * При потере ссылки на корень все дети также не попадут в результат
   */
  remove(...ids: string[]): void {
    this.patch(...ids.map((id) => ({ id, removed: true })));
  }
}
