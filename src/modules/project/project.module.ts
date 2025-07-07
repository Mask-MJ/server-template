import { Module, Logger } from '@nestjs/common';

import { MinioService } from 'src/common/minio/minio.service';
import { HttpModule } from '@nestjs/axios';
import { AnalysisTaskController } from './analysis-task/analysis-task.controller';
import { AnalysisTaskService } from './analysis-task/analysis-task.service';
import { FactoryController } from './factory/factory.controller';
import { FactoryService } from './factory/factory.service';
import { ValveController } from './valve/valve.controller';
import { ValveService } from './valve/valve.service';
import { UnitService } from './unit/unit.service';
import { UnitController } from './unit/unit.controller';

@Module({
  imports: [HttpModule.register({})],
  controllers: [
    FactoryController,
    UnitController,
    ValveController,
    AnalysisTaskController,
  ],
  providers: [
    FactoryService,
    UnitService,
    ValveService,
    AnalysisTaskService,
    MinioService,
    Logger,
  ],
})
export class ProjectModule {}
