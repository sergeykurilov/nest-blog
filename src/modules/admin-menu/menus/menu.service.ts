import { Injectable } from '@nestjs/common';
import { MenuNode } from '../responses/menu-node';
import { PatchMenuNode } from '../responses/nested-tree-node';

@Injectable()
export class MenuService {
  constructor() {}

  /**
   * Получит древовидную структуру меню
   * Если меню не найдено, вернет пустой массив
   * Все меню стоится от корня
   * Листовые узлы обязаны иметь ссылку или будут удалены
   */
  getMenu(): MenuNode[] {
    return [];
  }

  /**
   * Добавить конфигурацию узла меню
   *
   * Дочерние узлы будут связаны с родителем даже если
   *   они имеют свой признак parentId
   */
  add(...nodes: MenuNode[]): void {
    // TODO add nodes
  }

  /**
   * Модифицировать конфигурацию узла меню
   *
   * Древовидная модификация не поддерживается
   */
  patch(...nodes: PatchMenuNode[]): void {
    // TODO patch nodes
  }

  /**
   * По ID удаляется узел из дерева
   *
   * При потере ссылки на корень все дети также не попадут в результат
   */
  remove(...ids: string[]): void {
    // TODO remove
  }
}
