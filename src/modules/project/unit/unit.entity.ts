import { Unit } from '@prisma/client';
import { FactoryEntity } from '../factory/factory.entity';

export class UnitEntity implements Unit {
  id: number;
  name: string;
  status: boolean;
  remark: string;
  factoryId: number;
  factories: FactoryEntity;
  createBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
}
