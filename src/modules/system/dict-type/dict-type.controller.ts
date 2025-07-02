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
import { DictTypeService } from './dict-type.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { DictTypeEntity } from './dict-type.entity';
import {
  CreateDictTypeDto,
  QueryDictTypeDto,
  UpdateDictTypeDto,
} from './dict-type.dto';
import { Permissions } from 'src/modules/auth/authorization/decorators/permissions.decorator';
import { ApiPaginatedResponse } from '@/common/response/paginated.response';
import { ActiveUser } from '@/modules/auth/decorators/active-user.decorator';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';

@ApiTags('字典管理')
@ApiBearerAuth('bearer')
@Controller('dict-type')
export class DictTypeController {
  constructor(private readonly dictTypeService: DictTypeService) {}

  /**
   * 创建字典
   */
  @Post()
  @ApiCreatedResponse({ type: DictTypeEntity })
  @Permissions('system:dictType:create')
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createDictTypeDto: CreateDictTypeDto,
  ) {
    return this.dictTypeService.create(user, createDictTypeDto);
  }

  /**
   * 获取字典列表
   */
  @Get()
  @ApiPaginatedResponse(DictTypeEntity)
  @Permissions('system:dictType:query')
  findAll(@Query() queryDictTypeDto: QueryDictTypeDto) {
    return this.dictTypeService.findAll(queryDictTypeDto);
  }

  /**
   * 获取字典详情
   */
  @Get(':id')
  @ApiOkResponse({ type: DictTypeEntity })
  @Permissions('system:dictType:query')
  findOne(@Param('id') id: number) {
    return this.dictTypeService.findOne(id);
  }

  /**
   * 更新字典
   */
  @Patch(':id')
  @ApiOkResponse({ type: DictTypeEntity })
  @Permissions('system:dictType:update')
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateDictTypeDto: UpdateDictTypeDto,
  ) {
    return this.dictTypeService.update(id, user, updateDictTypeDto);
  }

  /**
   * 删除字典
   */
  @Delete(':id')
  @Permissions('system:dictType:delete')
  remove(@Param('id') id: number) {
    return this.dictTypeService.remove(id);
  }
}
