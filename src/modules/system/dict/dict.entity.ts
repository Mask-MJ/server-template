import { Dict, DictData } from '@prisma/client';

export class DictEntity implements Dict {
  id: number;
  name: string;
  value: string;
  status: boolean;
  createBy: string;
  updateBy: string | null;
  remark: string;
  createdAt: Date;
  updatedAt: Date;
}

export class DictDataEntity implements DictData {
  id: number;
  name: string;
  value: string;
  order: number;
  status: boolean;
  dictId: number;
  createBy: string;
  updateBy: string | null;
  remark: string;
  createdAt: Date;
  updatedAt: Date;
}
