import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateDictDto {
  /**
   * 字典名称
   * @example '性别'
   */
  @IsString()
  name: string;

  /**
   * 字典值
   * @example '1'
   */
  @IsString()
  value: string;

  /**
   * 状态
   * @example true
   */
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  /**
   * 备注
   * @example '备注'
   */
  @IsString()
  @IsOptional()
  remark?: string;
}
export class QueryDictDto extends PartialType(
  IntersectionType(PickType(CreateDictDto, ['name', 'value'])),
) {}

export class UpdateDictDto extends PartialType(CreateDictDto) {
  @IsNumber()
  id: number;
}

export class CreateDictDataDto {
  /**
   * 字典数据名称
   * @example '性别'
   */
  @IsString()
  name: string;

  /**
   * 字典数据值
   * @example '1'
   */
  @IsString()
  value: string;

  /**
   * 排序
   * @example 1
   */
  @IsOptional()
  @IsNumber()
  order?: number;

  /**
   * 状态 false: 禁用 true: 启用
   * @example true
   */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  status?: boolean = true;

  /**
   * 字典ID
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  dictId: number;

  /**
   * 备注
   * @example '备注'
   */
  @IsString()
  @IsOptional()
  remark?: string;
}

export class QueryDictDataDto extends PartialType(
  IntersectionType(PickType(CreateDictDataDto, ['name', 'value', 'dictId'])),
) {
  /**
   * 字典名称
   * @example '性别'
   */
  @IsString()
  @IsOptional()
  dictName?: string;
}

export class UpdateDictDataDto extends PartialType(CreateDictDataDto) {
  @IsNumber()
  id: number;
}
