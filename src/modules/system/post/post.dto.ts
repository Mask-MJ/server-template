import { BaseDto } from '@/common/dto/base.dto';
import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';
export class CreatePostDto {
  /**
   * 岗位编码
   * @example 'tech'
   */
  @IsString()
  code: string;
  /**
   * 岗位名称
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
   * 备注
   * @example '这是一个技术部'
   */
  @IsString()
  @IsOptional()
  remark?: string;
}

export class QueryPostDto extends PartialType(
  IntersectionType(PickType(CreatePostDto, ['name', 'code']), BaseDto),
) {}

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsNumber()
  id: number;
}
