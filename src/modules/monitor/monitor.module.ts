import { Module } from '@nestjs/common';
import { OperationController } from './operation/operation.controller';
import { OperationService } from './operation/operation.service';
import { LoginLogController } from './login-log/login-log.controller';
import { LoginLogService } from './login-log/login-log.service';

import { InfoController } from '../monitor/info/info.controller';
import { InfoService } from '../monitor/info/info.service';
@Module({
  imports: [],
  controllers: [OperationController, LoginLogController, InfoController],
  providers: [OperationService, LoginLogService, InfoService],
})
export class MonitorModule {}
