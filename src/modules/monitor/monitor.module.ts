import { Module } from '@nestjs/common';
import { OperationLogController } from './operation-log/operation-log.controller';
import { OperationLogService } from './operation-log/operation-log.service';
import { LoginLogController } from './login-log/login-log.controller';
import { LoginLogService } from './login-log/login-log.service';

import { InfoController } from '../monitor/info/info.controller';
import { InfoService } from '../monitor/info/info.service';
@Module({
  imports: [],
  controllers: [OperationLogController, LoginLogController, InfoController],
  providers: [OperationLogService, LoginLogService, InfoService],
})
export class MonitorModule {}
