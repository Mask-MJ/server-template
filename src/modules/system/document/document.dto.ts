import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDeptDto {
  /**
   * 部门名称
   * @example '技术部'
   */
  @IsString()
  name: string;
  /**
   * 排序
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  order?: number;
  /**
   * 负责人id
   * @example 1
   */
  @IsNumber()
  leaderId: number;
  /**
   * 负责人电话
   * @example '13000000000'
   */
  @IsString()
  @IsOptional()
  phone?: string;
  /**
   * 邮箱
   * @example xxx@qq.com
   */
  @IsString()
  @IsOptional()
  email?: string;
  /**
   * 上级部门ID
   */
  @IsNumber()
  @IsOptional()
  parentId?: number;
}

export class QueryDeptDto extends PartialType(
  IntersectionType(PickType(CreateDeptDto, ['name'])),
) {}

export class UpdateDeptDto extends PartialType(CreateDeptDto) {
  @IsNumber()
  id: number;
}
