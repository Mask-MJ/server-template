import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FactoryService } from './factory.service';
import {
  CreateFactoryDto,
  ImportValveDataDto,
  QueryFactoryDto,
  ReportDto,
  UpdateFactoryDto,
} from './factory.dto';
import { ActiveUser } from '@/modules/auth/decorators/active-user.decorator';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Permissions } from 'src/modules/auth/authorization/decorators/permissions.decorator';
import { FactoryEntity } from './factory.entity';

@ApiTags('工厂管理')
@ApiBearerAuth('bearer')
@Controller('factory')
export class FactoryController {
  constructor(private readonly factoryService: FactoryService) {}

  /**
   * 创建工厂
   */
  @Post()
  @ApiCreatedResponse({ type: FactoryEntity })
  @Permissions('project:factory:create')
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createFactoryDto: CreateFactoryDto,
  ) {
    return this.factoryService.create(user, createFactoryDto);
  }

  /**
   * 获取工厂列表
   */
  @Get()
  findAll(
    @ActiveUser() user: ActiveUserData,
    @Query() queryFactoryDto: QueryFactoryDto,
  ) {
    return this.factoryService.findAll(user, queryFactoryDto);
  }

  /**
   * 导入阀门数据
   * */
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importValveData(
    @ActiveUser() user: ActiveUserData,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ImportValveDataDto,
  ) {
    return this.factoryService.importValveData(user, file, body);
  }

  /**
   * 生成工厂中所有阀门报告
   * */
  @Post('report')
  generateReport(@Body() body: ReportDto) {
    return this.factoryService.generateReport(body);
  }
  /**
   * 获取工厂工作台详情
   * */
  @Get('chart/:id')
  @ApiOkResponse({ type: FactoryEntity })
  findChartData(@Param('id') id: number) {
    return this.factoryService.findChartData(id);
  }

  /**
   * 删除所有工厂
   * */
  @Delete('removeAll')
  @Permissions('project:factory:delete')
  removeAll(
    @ActiveUser() user: ActiveUserData,
    @Headers('X-Real-IP') ip: string,
  ) {
    return this.factoryService.removeAll(user, ip);
  }

  /**
   * 获取单个工厂
   */
  @Get(':id')
  @ApiOkResponse({ type: FactoryEntity })
  findOne(@Param('id') id: number) {
    return this.factoryService.findOne(id);
  }

  /**
   * 更新工厂
   */
  @Patch(':id')
  @ApiOkResponse({ type: FactoryEntity })
  @Permissions('project:factory:update')
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateFactoryDto: UpdateFactoryDto,
  ) {
    return this.factoryService.update(id, user, updateFactoryDto);
  }

  /**
   * 删除工厂
   */
  @Delete(':id')
  remove(
    @ActiveUser() user: ActiveUserData,
    @Param('id') id: number,
    @Headers('X-Real-IP') ip: string,
  ) {
    return this.factoryService.remove(user, id, ip);
  }
}
