import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DictService } from './dict.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { DictDataEntity, DictEntity } from './dict.entity';
import {
  CreateDictDataDto,
  CreateDictDto,
  QueryDictDataDto,
  QueryDictDto,
  UpdateDictDataDto,
  UpdateDictDto,
} from './dict.dto';
import { Permissions } from 'src/modules/auth/authorization/decorators/permissions.decorator';
import { ActiveUser } from '@/modules/auth/decorators/active-user.decorator';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';

@ApiTags('字典管理')
@ApiBearerAuth('bearer')
@Controller('dict')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  /**
   * 创建字典
   */
  @Post()
  @ApiCreatedResponse({ type: DictEntity })
  @Permissions('system:dict:create')
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createDictDto: CreateDictDto,
  ) {
    return this.dictService.create(user, createDictDto);
  }

  /**
   * 获取字典列表
   */
  @Get()
  @ApiOkResponse({ type: DictEntity, isArray: true })
  @Permissions('system:dict:query')
  findAll(@Query() queryDictDto: QueryDictDto) {
    return this.dictService.findAll(queryDictDto);
  }

  /**
   * 创建字典数据
   */
  @Post('data')
  @ApiCreatedResponse({ type: DictDataEntity })
  @Permissions('system:dictData:create')
  createData(
    @ActiveUser() user: ActiveUserData,
    @Body() createDictDataDto: CreateDictDataDto,
  ) {
    return this.dictService.createData(user, createDictDataDto);
  }
  /**
   * 获取字典数据列表
   */
  @Get('data')
  @ApiOkResponse({ type: DictDataEntity, isArray: true })
  @Permissions('system:dictData:query')
  findAllData(@Query() queryDictDataDto: QueryDictDataDto) {
    return this.dictService.findAllData(queryDictDataDto);
  }

  /**
   * 获取字典数据详情
   */
  @Get('data/:id')
  @ApiOkResponse({ type: DictDataEntity })
  @Permissions('system:dictData:query')
  findOneData(@Param('id') id: number) {
    return this.dictService.findOneData(id);
  }

  /**
   * 更新字典数据
   */
  @Patch('data/:id')
  @ApiOkResponse({ type: DictDataEntity })
  @Permissions('system:dictData:update')
  updateData(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateDictDataDto: UpdateDictDataDto,
  ) {
    return this.dictService.updateData(id, user, updateDictDataDto);
  }

  /**
   * 删除字典数据
   */
  @Delete('data/:id')
  @Permissions('system:dictData:delete')
  removeData(@Param('id') id: number) {
    return this.dictService.removeData(id);
  }

  /**
   * 获取字典详情
   */
  @Get(':id')
  @ApiOkResponse({ type: DictEntity })
  @Permissions('system:dict:query')
  findOne(@Param('id') id: number) {
    return this.dictService.findOne(id);
  }

  /**
   * 更新字典
   */
  @Patch(':id')
  @ApiOkResponse({ type: DictEntity })
  @Permissions('system:dict:update')
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateDictDto: UpdateDictDto,
  ) {
    return this.dictService.update(id, user, updateDictDto);
  }

  /**
   * 删除字典
   */
  @Delete(':id')
  @Permissions('system:dict:delete')
  remove(@Param('id') id: number) {
    return this.dictService.remove(id);
  }
}
