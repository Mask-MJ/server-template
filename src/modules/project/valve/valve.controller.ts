import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Headers,
} from '@nestjs/common';
import { ValveService } from './valve.service';
import { Permissions } from 'src/modules/auth/authorization/decorators/permissions.decorator';
import { ApiPaginatedResponse } from '@/common/response/paginated.response';
import { ActiveUser } from '@/modules/auth/decorators/active-user.decorator';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  CreateValveDto,
  QueryValveDto,
  QueryValveListDto,
  UpdateValveDto,
} from './valve.dto';
import { ValveEntity, ValveHistoryDataEntity } from './valve.entity';

@ApiTags('阀门管理')
@ApiBearerAuth('bearer')
@Controller('valve')
export class ValveController {
  constructor(private readonly valveService: ValveService) {}
  /**
   * 创建阀门
   */
  @Post()
  @ApiCreatedResponse({ type: ValveEntity })
  @Permissions('project:valve:create')
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createValveDto: CreateValveDto,
  ) {
    return this.valveService.create(user, createValveDto);
  }

  /**
   * 获取阀门列表
   */
  @Get()
  @ApiPaginatedResponse(ValveEntity)
  findAll(@Query() queryValveDto: QueryValveDto) {
    return this.valveService.findAll(queryValveDto);
  }

  /**
   * 导出阀门列表
   */
  @Get('export')
  @ApiPaginatedResponse(ValveEntity)
  exportValveList(@Query() queryValveDto: QueryValveDto) {
    return this.valveService.exportValveList(queryValveDto);
  }

  /**
   * 获取阀门运行数据列表
   */
  @Get('history-data')
  @ApiOkResponse({ type: ValveHistoryDataEntity, isArray: true })
  findHistoryDataList(@Query() queryValveListDto: QueryValveListDto) {
    return this.valveService.findHistoryDataList(queryValveListDto);
  }

  /**
   * 获取阀门运行数据详情
   */
  @Get('history-data/:id')
  findHistoryData(@Param('id') id: number) {
    return this.valveService.findHistoryData(id);
  }

  /**
   * 获取阀门评分列表
   */
  @Get('score')
  findScoreList(@Query() queryValveListDto: QueryValveListDto) {
    return this.valveService.findScoreList(queryValveListDto);
  }

  /**
   * 获取阀门评分详情
   */
  @Get('score/:id')
  findScore(@Param('id') id: number) {
    return this.valveService.findScore(id);
  }

  /**
   * 删除所有阀门
   * */
  @Delete('removeAll')
  @Permissions('project:valve:delete')
  removeAll(
    @ActiveUser() user: ActiveUserData,
    @Headers('X-Real-IP') ip: string,
  ) {
    return this.valveService.removeAll(user, ip);
  }

  /**
   * 获取阀门信息
   */
  @Get(':id')
  @ApiOkResponse({ type: ValveEntity })
  findOne(@Param('id') id: number) {
    return this.valveService.findOne(id);
  }

  /**
   * 更新阀门信息
   */
  @Patch(':id')
  @ApiOkResponse({ type: ValveEntity })
  @Permissions('project:valve:update')
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateValveDto: UpdateValveDto,
  ) {
    return this.valveService.update(id, user, updateValveDto);
  }

  /**
   * 删除阀门
   */
  @Delete(':id')
  @Permissions('project:valve:delete')
  remove(
    @ActiveUser() user: ActiveUserData,
    @Param('id') id: number,
    @Headers('X-Real-IP') ip: string,
  ) {
    return this.valveService.remove(user, id, ip);
  }
}
