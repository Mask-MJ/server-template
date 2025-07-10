import { ApiProperty } from '@nestjs/swagger';
import { Menu, MenuType, BadgeVariants, BadgeType } from '@prisma/client';

export class MenuEntity implements Menu {
  id: number;
  name: string;
  title: string | null;
  path: string;
  icon: string | null;
  activeIcon: string | null;
  @ApiProperty({ enum: MenuType })
  type: MenuType;
  status: boolean;
  activePath: string | null;
  affixTab: boolean;
  affixTabOrder: number;
  badge: string | null;
  @ApiProperty({ enum: BadgeType, nullable: true })
  badgeType: BadgeType | null;
  @ApiProperty({ enum: BadgeVariants, nullable: true })
  badgeVariants: BadgeVariants | null;
  hideChildrenInMenu: boolean;
  hideInMenu: boolean;
  hideInBreadcrumb: boolean;
  hideInTab: boolean;
  iframeSrc: string | null;
  link: string | null;
  keepAlive: boolean;
  maxNumOfOpenTabs: number | null;
  noBasicLayout: boolean;
  openInNewWindow: boolean;
  query: string | null;
  redirect: string | null;
  order: number;
  parentId: number | null;
  children?: MenuEntity[] | null;
  permission: string;
}
