import { Controller, Get, Param, Query } from '@nestjs/common';
import { LoginLogService } from './login-log.service';
import { ApiPaginatedResponse } from '@/common/response/paginated.response';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { QueryLoginLogDto } from './login-log.dto';
import { LoginLogEntity } from './login-log.entity';

@ApiTags('登录日志管理')
@ApiBearerAuth('bearer')
@Controller('login-log')
export class LoginLogController {
  constructor(private readonly loginLogService: LoginLogService) {}

  /**
   * 获取登录日志列表
   */
  @Get()
  @ApiPaginatedResponse(LoginLogEntity)
  findAll(@Query() queryLoginLogDto: QueryLoginLogDto) {
    return this.loginLogService.findAll(queryLoginLogDto);
  }

  /**
   * 获取登录日志详情
   */
  @Get(':id')
  @ApiOkResponse({ type: LoginLogEntity })
  findOne(@Param('id') id: number) {
    return this.loginLogService.findOne(id);
  }
}
