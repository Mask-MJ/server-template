import { Menu } from '@prisma/client';
export class MenuEntity implements Menu {
  id: number;
  name: string;
  path: string;
  icon: string;
  activeIcon: string;
  type: string;
  visible: boolean;
  isCache: boolean;
  status: boolean;
  order: number;
  parentId: number | null;
  children?: MenuEntity[] | null;
  permission: string;
  remark: string;
  createBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
}
