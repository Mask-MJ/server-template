import { Role } from '@prisma/client';

export class RoleEntity implements Role {
  id: number;
  name: string;
  value: string;
  order: number;
  status: boolean;
  remark: string;
  createBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
}
