import { MenuNode } from './menu-node';

export interface NestedTreeNode {
  name: string;
  href?: string;
  icon?: string;
  children?: NestedTreeNode[];
}

export type PatchMenuNode = Pick<MenuNode, 'id'> &
  Partial<Omit<MenuNode, 'id' | 'children'>>;
