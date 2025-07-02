import { Controller, Get, Param, Query } from '@nestjs/common';
import { OperationService } from './operation.service';
import { ApiPaginatedResponse } from '@/common/response/paginated.response';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { QueryOperationDto } from './operation.dto';
import { OperationEntity } from './operation.entity';

@ApiTags('操作日志管理')
@ApiBearerAuth('bearer')
@Controller('operation')
export class OperationController {
  constructor(private readonly operationService: OperationService) {}

  /**
   * 获取日志列表
   */
  @Get()
  @ApiPaginatedResponse(OperationEntity)
  findAll(@Query() queryOperationDto: QueryOperationDto) {
    return this.operationService.findAll(queryOperationDto);
  }

  /**
   * 获取日志详情
   */
  @Get(':id')
  @ApiOkResponse({ type: OperationEntity })
  findOne(@Param('id') id: number) {
    return this.operationService.findOne(id);
  }
}
