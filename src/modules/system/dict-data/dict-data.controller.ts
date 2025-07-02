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
import { DictDataService } from './dict-data.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  CreateDictDataDto,
  QueryDictDataDto,
  UpdateDictDataDto,
} from './dict-data.dto';
import { Permissions } from 'src/modules/auth/authorization/decorators/permissions.decorator';
import { DictDataEntity } from './dict-data.entity';
import { ApiPaginatedResponse } from '@/common/response/paginated.response';
import { ActiveUser } from '@/modules/auth/decorators/active-user.decorator';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
@ApiTags('字典数据管理')
@ApiBearerAuth('bearer')
@Controller('dict-data')
export class DictDataController {
  constructor(private readonly dictDataService: DictDataService) {}

  /**
   * 创建字典数据
   */
  @Post()
  @ApiCreatedResponse({ type: DictDataEntity })
  @Permissions('system:dictData:create')
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createDictDataDto: CreateDictDataDto,
  ) {
    return this.dictDataService.create(user, createDictDataDto);
  }

  @Get()
  @ApiOperation({ summary: '获取字典数据列表' })
  @ApiPaginatedResponse(DictDataEntity)
  @Permissions('system:dictData:query')
  findAll(@Query() queryDictDataDto: QueryDictDataDto) {
    return this.dictDataService.findAll(queryDictDataDto);
  }

  /**
   * 获取字典数据详情
   */
  @Get(':id')
  @ApiOkResponse({ type: DictDataEntity })
  @Permissions('system:dictData:query')
  findOne(@Param('id') id: number) {
    return this.dictDataService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新字典数据' })
  @ApiOkResponse({ type: DictDataEntity })
  @Permissions('system:dictData:update')
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateDictDataDto: UpdateDictDataDto,
  ) {
    return this.dictDataService.update(id, user, updateDictDataDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除字典数据' })
  @Permissions('system:dictData:delete')
  remove(@Param('id') id: number) {
    return this.dictDataService.remove(id);
  }
}
