import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
} from 'class-validator';
import { TimeDto, UploadDto } from 'src/common/dto/base.dto';

export class CreateFactoryDto {
  /**
   * 工厂名称
   * @example '工厂1'
   */
  @IsString()
  name: string;

  /**
   * 状态 false: 禁用 true: 启用
   * @example true
   */
  @IsOptional()
  @IsBoolean()
  status?: boolean = true;

  /**
   * 行业
   * @example '新能源'
   */
  @IsString()
  @IsOptional()
  industry?: string;

  /**
   * 地址编码
   * @example '130010'
   */
  @IsString()
  @IsOptional()
  code?: string;

  /**
   * 省份
   * @example '广东省'
   */
  @IsString()
  @IsOptional()
  province?: string;

  /**
   * 城市
   * @example '广州市'
   */
  @IsString()
  @IsOptional()
  city?: string;

  /**
   * 区县
   * @example '天河区'
   */
  @IsString()
  @IsOptional()
  county?: string;

  /**
   * 工厂地址
   * @example '地址1'
   */
  @IsString()
  @IsOptional()
  address?: string;

  /**
   * 工厂坐标(经度)
   * @example 1.1
   */
  @IsString()
  longitude?: string = '';

  /**
   * 工厂坐标(纬度)
   * @example 1.1
   */
  @IsString()
  latitude?: string = '';

  /**
   * 工厂描述
   * @example '描述1'
   */
  @IsString()
  remark?: string = '';

  /**
   * 父级id
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  parentId?: number;
}

export class QueryFactoryDto extends PartialType(
  IntersectionType(PickType(CreateFactoryDto, ['name']), TimeDto),
) {
  @IsOptional()
  @IsNumber()
  filterId?: number;
}

export class UpdateFactoryDto extends PartialType(CreateFactoryDto) {
  @IsNumber()
  id: number;
}

export class ImportValveDataDto extends UploadDto {
  @IsNumber()
  factoryId: number;

  @IsString()
  @IsOptional()
  reportMode?: string;
}

export class ReportDto {
  /**
   * 工厂id
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  factoryId?: number;
  /**
   * 分析任务id
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  analysisTaskId?: number;
  /**
   * 报告模式
   * @example 'factory'
   */
  @IsString()
  @IsOptional()
  reportMode?: string;

  /**
   * 阀门ids
   * @example [1, 2, 3]
   */
  @IsOptional()
  @IsArray()
  valveTags?: string[];
}
