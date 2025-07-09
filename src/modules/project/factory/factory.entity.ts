import { Factory } from '@prisma/client';

export class FactoryEntity implements Factory {
  id: number;
  name: string;
  status: boolean;
  code: string;
  industry: string;
  province: string;
  city: string;
  county: string;
  address: string;
  longitude: string;
  latitude: string;
  parentId: number | null;
  remark: string;
  createBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
}
