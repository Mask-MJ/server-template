import { Module } from '@nestjs/common';
import { OperationController } from './operation/operation.controller';
import { OperationService } from './operation/operation.service';
import { InfoController } from '../monitor/info/info.controller';
import { InfoService } from '../monitor/info/info.service';
@Module({
  imports: [],
  controllers: [OperationController, InfoController],
  providers: [OperationService, InfoService],
})
export class MonitorModule {}
