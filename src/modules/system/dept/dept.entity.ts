import { Dept } from '@prisma/client';

export class DeptEntity implements Dept {
  id: number;
  name: string;
  order: number;
  leader: string;
  phone: string;
  email: string;
  parentId: number | null;
  children?: DeptEntity[] | null;
  createBy: string;
  updateBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}
