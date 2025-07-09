import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class CreateUnitDto {
  /**
   * 装置名称
   * @example '装置1'
   */
  @IsString()
  name: string;

  /**
   * 状态 false: 禁用 true: 启用
   * @example true
   */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  status?: boolean = true;

  /**
   * 装置描述
   * @example '这是一个装置'
   */
  @IsString()
  remark?: string = '';

  /**
   * 工厂id
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  factoryId: number;

  /**
   * 阀门ids
   * @example [1, 2, 3]
   */
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  valveIds?: number[];
}

export class QueryUnitDto extends PartialType(
  IntersectionType(PickType(CreateUnitDto, ['name', 'factoryId']), BaseDto),
) {}

export class UpdateUnitDto extends PartialType(CreateUnitDto) {
  @IsNumber()
  id: number;
}
