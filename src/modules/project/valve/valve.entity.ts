import { Prisma, Valve, ValveHistoryData } from '@prisma/client';
import { UnitEntity } from '../unit/unit.entity';
import { FactoryEntity } from '../factory/factory.entity';

export class ValveEntity implements Valve {
  id: number;

  /// 来源
  source: string;
  /// 编码
  no: string;
  /// 阀门位号
  tag: string;
  /// 介质
  fluidName: string;
  /// 关键应用
  criticalApplication: string;
  /// 投用时间
  since: Date;
  /// 阀体序列号
  serialNumber: string;
  /// 阀体品牌
  valveBrand: string;
  /// 阀体系列
  valveSeries: string;
  /// 阀体类型
  // valveType: string;
  /// 阀体口径
  valveSize: string;
  /// 阀体流量系数
  valveCv: string;
  /// 阀体磅级
  valveRating: string;
  /// 阀体连接形式
  valveEndConnection: string;
  /// 阀体阀体材质
  valveBodyMaterial: string;
  /// 阀盖形式
  valveBonnet: string;
  /// 流量特性
  valveTrim: string;
  /// 阀体泄漏等级
  valveSeatLeakage: string;
  /// 阀体描述
  valveDescription: string;
  /// 执行机构品牌
  actuatorBrand: string;
  /// 执行机构系列
  actuatorSeries: string;
  /// 执行机构尺寸
  actuatorSize: string;
  /// 手轮
  handwheel: string;
  /// 执行机构描述
  actuatorDescription: string;
  /// 故障位置
  actuatorFailurePosition: string;
  /// 过滤减压阀品牌 REGULATOR BRAND
  regulatorBrand: string;
  /// 过滤减压阀型号 REGULATOR MODEL
  regulatorModel: string;
  /// 过滤减压阀描述
  regulatorDescription: string;
  /// 定位器品牌
  positionerBrand: string;
  /// 定位器型号 POSITIONER MODEL
  positionerModel: string;
  /// 定位器描述
  positionerDescription: string;
  /// 电磁阀品牌 SOV BRAND
  sovBrand: string;
  /// 电磁阀型号 SOV MODEL
  sovModel: string;
  /// 电磁阀数量 SOV QTY
  sovQty: number;
  /// 电磁阀描述
  sovDescription: string;
  /// 限位开关品牌 LS BRAND
  lsBrand: string;
  /// 限位开关型号 LS MODEL
  lsModel: string;
  /// 限位开关数量 LS QTY
  lsQty: number;
  /// 限位开关描述
  lsDescription: string;
  /// 保位阀品牌 TRIP VALVE BRAND
  tripValveBrand: string;
  /// 保位阀型号 TRIP VALVE MODEL
  tripValveModel: string;
  /// 保位阀描述
  tripValveDescription: string;
  /// 放大器品牌 VB BRAND
  vbBrand: string;
  /// 放大器型号 VB MODEL
  vbModel: string;
  /// 放大器数量 VB QTY
  vbQty: number;
  /// 放大器描述
  vbDescription: string;
  /// 快排阀品牌 QE BRAND
  qeBrand: string;
  /// 快排阀型号 QE MODEL
  qeModel: string;
  /// 快排阀数量 QE QTY
  qeQty: number;
  /// 快排阀描述
  qeDescription: string;
  /// 气控阀品牌 PILOT BRAND
  pilotBrand: string;
  /// 气控阀型号 PILOT MODEL
  pilotModel: string;
  /// 气控阀数量 PILOT QTY
  pilotQty: number;
  /// 气控阀描述
  pilotDescription: string;
  /// 阀体阀杆尺寸 Valve Stem Size
  valveStemSize: string;
  /// 行程 Stroke
  stroke: string;
  /// 信号比较器品牌 SIGNAL COMPARATOR BRAND
  signalComparatorBrand: string;
  /// 信号比较器型号 SIGNAL COMPARATOR MODEL
  signalComparatorModel: string;
  /// 信号比较器描述
  signalComparatorDescription: string;

  /// 备件
  parts: string;
  /// 分析任务id
  analysisTaskId: number;
  factoryId: number;
  factory: FactoryEntity;
  /// 关联装置id
  unitId: number;
  unit: UnitEntity;
  createBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ValveHistoryDataEntity implements ValveHistoryData {
  id: number;
  /// 阀门位号
  tag: string;
  /// 阀门id
  valveId: number;
  /// 读取时间
  time: Date;
  data: Prisma.JsonArray;
}
