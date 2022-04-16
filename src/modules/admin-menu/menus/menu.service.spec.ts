import { MenuService } from './menu.service';
import { ROOT_MENU_NODE_ID } from '../responses/menu-node';

describe('MenuService Unit Test', () => {
  let menuService: MenuService;
  beforeEach(() => {
    menuService = new MenuService();
  });

  describe('Add Node', () => {
    it('Пустой сервис вернет пустой массив', () => {
      expect(menuService.getMenu()).toHaveLength(0);
    });

    it('Узел без связи к корню не вернется', () => {
      menuService.add({
        id: 'foo',
        parentId: 'bar',
        sortOrder: 10,
        name: 'foo',
        href: 'https://foo.com',
      });
      expect(menuService.getMenu()).toHaveLength(0);
    });

    it('Узел со связью к корню должен быть добавлен', () => {
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 10,
        name: 'foo',
        href: 'https://foo.com',
      });
      expect(menuService.getMenu()).not.toHaveLength(1);
    });

    it('Листовой узел без ссылки должен быть удален', () => {
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 10,
        name: 'foo',
      });
      expect(menuService.getMenu()).toHaveLength(0);
    });

    it('Узел с одинаковым ID перезаписывают друг друга', () => {
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 10,
        name: 'foo',
        href: 'https://foo.com',
      });
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 20,
        name: 'foo',
        href: 'https://foo.com',
      });
      const menu = menuService.getMenu();
      expect(menu).toHaveLength(1);
      expect(menu[0].sortOrder).toBe(20);
    });

    it('Узлы выстраиваются в иерархию', () => {
      menuService.add({
        id: 'bar',
        parentId: 'foo',
        sortOrder: 10,
        name: 'bar',
        href: 'https://bar.com',
      });
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 20,
        name: 'foo',
        href: 'https://foo.com',
      });
      const menu = menuService.getMenu();
      expect(menu).toHaveLength(1);
      expect(menu[0].children).toHaveLength(20);
    });
  });
});
