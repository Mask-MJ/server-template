import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { MenuType, BadgeVariants, BadgeType } from '@prisma/client';
export class CreateMenuDto {
  /**
   * 菜单名称
   * @example '系统管理'
   */
  @IsString()
  name: string;

  /**
   * 菜单路径
   * @example '/system'
   */
  @IsString()
  @IsOptional()
  path?: string;

  /**
   * 菜单标题 (配置页面的标题,配合国际化使用)
   * @example 'system.title
   */
  @IsString()
  @IsOptional()
  title?: string;

  /**
   * 菜单图标
   * @example 'i-line-md:external-link'
   */
  @IsString()
  @IsOptional()
  icon?: string;

  /**
   * 激活菜单图标
   * @example 'i-line-md:external-link'
   */
  @IsString()
  @IsOptional()
  activeIcon?: string;

  /**
   * 菜单类别
   * @example 'menu'
   */
  @IsString()
  @IsEnum(MenuType)
  @ApiProperty({ enum: MenuType })
  type: MenuType;

  /**
   * 状态 false: 禁用 true: 启用
   * @example true
   */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  status?: boolean = true;

  /**
   * 作为路由时，需要激活的菜单的Path
   * @example '/system'
   */
  @IsString()
  @IsOptional()
  activePath?: string;

  /**
   * 固定在标签栏
   * @example true
   */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  affixTab?: boolean = true;

  /**
   * 在标签栏固定的顺序
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  affixTabOrder?: number = 1;

  /**
   * 徽标内容 (当徽标类型为normal时有效)
   * @example 'new'
   */
  @IsString()
  @IsOptional()
  badge?: string;

  /**
   * 徽标类型
   * @example 'dot'
   */
  @IsString()
  @IsEnum(BadgeType)
  @IsOptional()
  badgeType?: BadgeType;

  /**
   * 徽标颜色
   * @example 'default'
   */
  @IsString()
  @IsEnum(BadgeVariants)
  @IsOptional()
  badgeVariants?: BadgeVariants;

  /**
   * 在菜单中隐藏下级
   * @example false
   */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hideChildrenInMenu?: boolean = false;

  /**
   * 在面包屑中隐藏
   * @example false
   */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hideInBreadcrumb?: boolean = false;

  /**
   * 在菜单中隐藏
   * @example false
   */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hideInMenu?: boolean = false;

  /**
   * 在标签栏中隐藏
   * @example false
   */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hideInTab?: boolean = false;

  /**
   * 内嵌Iframe的URL
   * @example 'www.example.com'
   */
  @IsString()
  @IsOptional()
  iframeSrc?: string;

  /**
   * 外链页面的URL
   * @example 'www.example.com'
   */
  @IsString()
  @IsOptional()
  link?: string;

  /**
   * 是否缓存页面
   * @example false
   */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  keepAlive?: boolean = false;

  /**
   * 同一个路由最大打开的标签数
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  maxNumOfOpenTabs?: number = 1;

  /**
   * 无需基础布局
   * @example false
   */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  noBasicLayout?: boolean = false;

  /**
   * 是否在新窗口打开
   * @example false
   */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  openInNewWindow?: boolean = false;

  /**
   * 额外的路由参数
   * @example '/:id'
   */
  @IsString()
  @IsOptional()
  query?: string;

  /**
   * 重定向
   * @example '/system'
   */
  @IsString()
  @IsOptional()
  redirect?: string;

  /**
   * 排序
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  order?: number = 1;

  /**
   * 权限标识
   * @example 'system:menu:list'
   */
  @IsString()
  @IsOptional()
  permission?: string;

  /**
   * 父级菜单id
   * @example 0
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  parentId?: number;
}

export class QueryMenuDto extends PartialType(
  IntersectionType(PickType(CreateMenuDto, ['name', 'path'])),
) {}

export class UpdateMenuDto extends IntersectionType(
  PartialType(CreateMenuDto),
  PickType(CreateMenuDto, ['name', 'path', 'type']),
) {
  @IsNumber()
  id: number;
}
