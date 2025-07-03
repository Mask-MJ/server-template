import { Controller, Get, Param, Query } from '@nestjs/common';
import { OperationLogService } from './operation-log.service';
import { ApiPaginatedResponse } from '@/common/response/paginated.response';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { QueryOperationLogDto } from './operation-log.dto';
import { OperationLogEntity } from './operation-log.entity';

@ApiTags('操作日志管理')
@ApiBearerAuth('bearer')
@Controller('operation')
export class OperationLogController {
  constructor(private readonly operationLogService: OperationLogService) {}

  /**
   * 获取操作日志列表
   */
  @Get()
  @ApiPaginatedResponse(OperationLogEntity)
  findAll(@Query() queryOperationDto: QueryOperationLogDto) {
    return this.operationLogService.findAll(queryOperationDto);
  }

  /**
   * 获取操作日志详情
   */
  @Get(':id')
  @ApiOkResponse({ type: OperationLogEntity })
  findOne(@Param('id') id: number) {
    return this.operationLogService.findOne(id);
  }
}
