import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { TimeDto } from 'src/common/dto/base.dto';
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
   * 菜单图标
   * @example 'i-line-md:external-link'
   */
  @IsString()
  @IsOptional()
  icon?: string;

  /**
   * 菜单类别 C:目录 M:菜单 B:按钮
   * @example 'C'
   */
  @IsString()
  @IsEnum(['C', 'M', 'B'])
  type: string;

  /**
   * 是否可见
   * @example true
   */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  visible?: boolean = true;

  /**
   * 状态 false: 禁用 true: 启用
   * @example true
   */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  status?: boolean = true;

  /**
   * 排序
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  order?: number = 1;

  /**
   * 是否缓存 false: 禁用 true: 启用
   * @example true
   */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isCache?: boolean = true;

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
  IntersectionType(PickType(CreateMenuDto, ['name', 'visible']), TimeDto),
) {}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @IsNumber()
  id: number;
}
