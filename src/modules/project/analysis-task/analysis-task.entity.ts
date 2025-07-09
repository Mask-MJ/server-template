import { AnalysisTask } from '@prisma/client';
export class AnalysisTaskEntity implements AnalysisTask {
  id: number;
  name: string;
  status: number;
  remark: string;
  files: string[];
  factoryId: number;
  result: number[];
  ruleId: number;
  createBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
}
