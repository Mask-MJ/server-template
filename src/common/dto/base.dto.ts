import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';

export class PaginateDto {
  /**
   * 页码
   * @example 1
   */
  @IsNumber()
  page: number = 1;

  /**
   * 每页数量
   * @example 10
   */
  @IsNumber()
  pageSize: number = 10;
}

export class TimeDto {
  /**
   * 开始时间
   * @example '2024-01-01 00:00:00'
   */
  @Type(() => Date)
  beginTime: Date;

  /**
   * 结束时间
   * @example '2025-01-01 00:00:00'
   */
  @Type(() => Date)
  endTime: Date;
}

export class BaseDto extends IntersectionType(PaginateDto, TimeDto) {}

export class UploadDto {
  @IsString()
  fileName: string;
  file: Express.Multer.File;
}
