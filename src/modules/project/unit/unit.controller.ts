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
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnitDto, QueryUnitDto, UpdateUnitDto } from './unit.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '@/common/response/paginated.response';
import { ActiveUser } from '@/modules/auth/decorators/active-user.decorator';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import { UnitEntity } from './unit.entity';
import { Permissions } from 'src/modules/auth/authorization/decorators/permissions.decorator';

@ApiTags('装置管理')
@ApiBearerAuth('bearer')
@Controller('unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  /**
   * 创建装置
   * */
  @Post()
  @ApiCreatedResponse({ type: UnitEntity })
  @Permissions('project:unit:create')
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createUnitDto: CreateUnitDto,
  ) {
    return this.unitService.create(user, createUnitDto);
  }

  /**
   * 获取装置列表
   * */
  @Get()
  @ApiPaginatedResponse(UnitEntity)
  @Permissions('project:unit:query')
  findAll(@Query() queryUnitDto: QueryUnitDto) {
    return this.unitService.findAll(queryUnitDto);
  }

  /**
   * 全部删除
   * */
  @Delete('removeAll')
  @Permissions('project:unit:delete')
  removeAll(
    @ActiveUser() user: ActiveUserData,
    @Headers('X-Real-IP') ip: string,
  ) {
    return this.unitService.removeAll(user, ip);
  }

  /**
   * 获取装置信息
   * */
  @Get(':id')
  @ApiOkResponse({ type: UnitEntity })
  @Permissions('project:unit:query')
  findOne(@Param('id') id: number) {
    return this.unitService.findOne(id);
  }

  /**
   * 更新装置
   * */
  @Patch(':id')
  @ApiOkResponse({ type: UnitEntity })
  @Permissions('project:unit:update')
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    return this.unitService.update(id, user, updateUnitDto);
  }

  /**
   * 删除装置
   * */
  @Delete(':id')
  @Permissions('project:unit:delete')
  remove(
    @ActiveUser() user: ActiveUserData,
    @Param('id') id: number,
    @Headers('X-Real-IP') ip: string,
  ) {
    return this.unitService.remove(user, id, ip);
  }
}
