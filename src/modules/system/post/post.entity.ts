import { Post } from '@prisma/client';

export class PostEntity implements Post {
  id: number;
  code: string;
  name: string;
  order: number;
  remark: string;
  createBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
}
