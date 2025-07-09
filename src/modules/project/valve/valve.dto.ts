import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { BaseDto, TimeDto } from 'src/common/dto/base.dto';
import dayjs from 'dayjs';

export class CreateValveDto {
  /**
   * 阀门位号
   * @example 'FV-3001B'
   */
  @IsString()
  tag: string;

  /**
   * 来源
   * @example 'hart'
   */
  @IsString()
  @IsOptional()
  source?: string;

  /**
   * 介质
   * @example '氨水'
   */
  @IsString()
  @IsOptional()
  fluidName?: string;

  /**
   * 关键应用
   * @example '反应器'
   */
  @IsString()
  @IsOptional()
  criticalApplication?: string;

  /**
   * 阀体序列号
   * @example '123456'
   */
  @IsString()
  @IsOptional()
  serialNumber?: string;

  /**
   * 投用时间
   * @example 1714752000000
   */
  @IsOptional()
  @Transform(({ value }) => (value ? dayjs(value).format() : null), {
    toClassOnly: true,
  })
  since?: Date;

  /**
   * 阀体品牌
   * @example 'Fisher'
   */
  @IsString()
  @IsOptional()
  valveBrand?: string;

  /**
   * 系列
   * @example '系列'
   */
  @IsString()
  @IsOptional()
  valveSeries?: string;

  /**
   * 阀体类型
   * @example '球阀'
   */
  @IsString()
  @IsOptional()
  valveType?: string;

  /**
   * 阀体口径
   * @example 'DN50'
   */
  @IsString()
  @IsOptional()
  valveSize?: string;

  /**
   * 阀体流量系数
   * @example 'DN50'
   */
  @IsString()
  @IsOptional()
  valveCv?: string;

  /**
   * 阀体磅级
   * @example 'DN50'
   */
  @IsString()
  @IsOptional()
  valveRating?: string;

  /**
   * 阀体阀杆尺寸
   * @example 'DN50'
   */
  @IsString()
  @IsOptional()
  valveStemSize?: string;

  /**
   * 阀体连接形式
   * @example '法兰'
   */
  @IsString()
  @IsOptional()
  valveEndConnection?: string;

  /**
   * 阀体阀体材质
   * @example '碳钢'
   */
  @IsString()
  @IsOptional()
  valveBodyMaterial?: string;

  /**
   * 阀盖形式
   * @example '法兰'
   */
  @IsString()
  @IsOptional()
  valveBonnet?: string;

  /**
   * 流量特性
   * @example '316'
   */
  @IsString()
  @IsOptional()
  valveTrim?: string;

  /**
   * 阀体泄漏等级
   * @example 'V'
   */
  @IsString()
  @IsOptional()
  valveSeatLeakage?: string;

  /**
   * 阀体描述
   * @example '...'
   */
  @IsString()
  @IsOptional()
  valveDescription?: string;

  /**
   * 执行机构品牌
   * @example 'Fisher'
   */
  @IsString()
  @IsOptional()
  actuatorBrand?: string;

  /**
   * 执行机构系列
   * @example '系列1'
   */
  @IsString()
  @IsOptional()
  actuatorSeries?: string;

  /**
   * 执行机构尺寸
   * @example 'DN50'
   */
  @IsString()
  @IsOptional()
  actuatorSize?: string;

  /**
   * 故障位置
   * @example 'DN50'
   */
  @IsString()
  @IsOptional()
  actuatorFailurePosition?: string;

  /**
   * 手轮
   * @example '有'
   */
  @IsString()
  @IsOptional()
  handwheel?: string;

  /**
   * 执行机构描述
   * @example '...'
   */
  @IsString()
  @IsOptional()
  actuatorDescription?: string;

  /**
   * 定位器品牌
   * @example 'Fisher'
   */
  @IsString()
  @IsOptional()
  positionerBrand?: string;

  /**
   * 定位器类型
   * @example '气动'
   */
  @IsString()
  @IsOptional()
  positionerModel?: string;

  /**
   * 定位器描述
   * @example '...'
   */
  @IsString()
  @IsOptional()
  positionerDescription?: string;

  /**
   * 限位开关品牌
   * @example 'LS BRAND'
   */
  @IsString()
  @IsOptional()
  lsBrand?: string;

  /**
   * 限位开关型号
   * @example 'LS MODEL'
   */
  @IsString()
  @IsOptional()
  lsModel?: string;

  /**
   * 限位开关数量
   * @example 10
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  lsQty?: number;

  /**
   * 限位开关描述
   * @example '...'
   */
  @IsString()
  @IsOptional()
  lsDescription?: string;

  /**
   * 气控阀品牌
   * @example 'PILOT BRAND'
   */
  @IsString()
  @IsOptional()
  pilotBrand?: string;

  /**
   * 气控阀型号
   * @example 'PILOT MODEL'
   */
  @IsString()
  @IsOptional()
  pilotModel?: string;

  /**
   * 气控阀数量
   * @example 10
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pilotQty?: number;

  /**
   * 气控阀描述
   * @example '...'
   */
  @IsString()
  @IsOptional()
  pilotDescription?: string;

  /**
   * 快排阀品牌
   * @example 'QE BRAND'
   */
  @IsString()
  @IsOptional()
  qeBrand?: string;

  /**
   * 快排阀型号
   * @example 'QE MODEL'
   */
  @IsString()
  @IsOptional()
  qeModel?: string;

  /**
   * 快排阀数量
   * @example 10
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  qeQty?: number;

  /**
   * 快排阀描述
   * @example '...'
   */
  @IsString()
  @IsOptional()
  qeDescription?: string;

  /**
   * 过滤减压阀品牌
   * @example 'REGULATOR BRAND'
   */
  @IsString()
  @IsOptional()
  regulatorBrand?: string;

  /**
   * 过滤减压阀型号
   * @example 'REGULATOR MODEL'
   */
  @IsString()
  @IsOptional()
  regulatorModel?: string;

  /**
   * 过滤减压阀描述
   * @example '...'
   */
  @IsString()
  @IsOptional()
  regulatorDescription?: string;

  /**
   * 信号比较器品牌
   * @example 'SIGNAL COMPARATOR BRAND'
   */
  @IsString()
  @IsOptional()
  signalComparatorBrand?: string;

  /**
   * 信号比较器型号
   * @example 'SIGNAL COMPARATOR MODEL'
   */
  @IsString()
  @IsOptional()
  signalComparatorModel?: string;

  /**
   * 信号比较器描述
   * @example '...'
   */
  @IsString()
  @IsOptional()
  signalComparatorDescription?: string;

  /**
   * 电磁阀品牌
   * @example 'SOV BRAND'
   */
  @IsString()
  @IsOptional()
  sovBrand?: string;

  /**
   * 电磁阀型号
   * @example 'SOV MODEL'
   */
  @IsString()
  @IsOptional()
  sovModel?: string;

  /**
   * 电磁阀数量
   * @example 10
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sovQty?: number;

  /**
   * 电磁阀描述
   * @example '...'
   */
  @IsString()
  @IsOptional()
  sovDescription?: string;

  /**
   * 保位阀品牌
   * @example 'TRIP VALVE BRAND'
   */
  @IsString()
  @IsOptional()
  tripValveBrand?: string;

  /**
   * 保位阀型号
   * @example 'TRIP VALVE MODEL'
   */
  @IsString()
  @IsOptional()
  tripValveModel?: string;

  /**
   * 保位阀描述
   * @example '...'
   */
  @IsString()
  @IsOptional()
  tripValveDescription?: string;

  /**
   * 放大器品牌
   * @example 'VB BRAND'
   */
  @IsString()
  @IsOptional()
  vbBrand?: string;

  /**
   * 放大器型号
   * @example 'VB MODEL'
   */
  @IsString()
  @IsOptional()
  vbModel?: string;

  /**
   * 放大器数量
   * @example 10
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  vbQty?: number;

  /**
   * 放大器描述
   * @example '...'
   */
  @IsString()
  @IsOptional()
  vbDescription?: string;

  /**
   * 附件种类
   * @example '...'
   */
  @IsString()
  @IsOptional()
  accessory?: string;

  /**
   * 附件品牌
   * @example '...'
   */
  @IsString()
  @IsOptional()
  accessoryBrand?: string;

  /**
   * 附件类型
   * @example '...'
   */
  @IsString()
  @IsOptional()
  accessoryType?: string;

  /**
   * 附件数量
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  accessoryQuantity?: number;

  /**
   * 附件描述
   * @example '...'
   */
  @IsString()
  @IsOptional()
  accessoryDescription?: string;

  /**
   * 备注
   * @example '...'
   */
  @IsString()
  @IsOptional()
  remark?: string;

  /**
   * 装置id
   * @example 1
   */
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  unitId?: number;

  /**
   * 工厂id
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  factoryId: number;

  /**
   * 分析任务id
   * @example 1
   */
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  analysisTaskId?: number;
}
export class QueryValveDto extends PartialType(
  IntersectionType(
    PickType(CreateValveDto, ['tag', 'factoryId', 'unitId', 'analysisTaskId']),
    BaseDto,
  ),
) {}

export class UpdateValveDto extends PartialType(CreateValveDto) {
  @IsNumber()
  id: number;
}

export class QueryValveListDto extends PartialType(TimeDto) {
  @IsNumber()
  @Type(() => Number)
  valveId: number;
}
