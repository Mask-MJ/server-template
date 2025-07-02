import { OperationLog } from '@prisma/client';

export class OperationEntity implements OperationLog {
  id: number;
  title: string;
  businessType: number;
  module: string;
  username: string;
  ip: string;
  address: string;
  createdAt: Date;
}
