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
import { KnowledgeBaseService } from './knowledgeBase.service';
import {
  CreateKnowledgeBaseDto,
  QueryKnowledgeBaseDto,
  UpdateKnowledgeBaseDto,
} from './knowledgeBase.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ActiveUser } from '@/modules/auth/decorators/active-user.decorator';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import { KnowledgeBaseEntity } from './knowledgeBase.entity';
import { Permissions } from 'src/modules/auth/authorization/decorators/permissions.decorator';

@ApiTags('知识库管理')
@ApiBearerAuth('bearer')
@Controller('knowledge-base')
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}
  /**
   * 创建知识库
   */
  @Post()
  @ApiCreatedResponse({ type: KnowledgeBaseEntity })
  @Permissions('system:knowledgeBase:create')
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createKnowledgeBaseDto: CreateKnowledgeBaseDto,
  ) {
    return this.knowledgeBaseService.create(user, createKnowledgeBaseDto);
  }

  /**
   * 获取知识库列表
   */
  @Get()
  @ApiOkResponse({ type: KnowledgeBaseEntity, isArray: true })
  findAll(@Query() queryKnowledgeBaseDto: QueryKnowledgeBaseDto) {
    return this.knowledgeBaseService.findAll(queryKnowledgeBaseDto);
  }

  /**
   * 获取知识库详情
   */
  @Get(':id')
  @ApiOkResponse({ type: KnowledgeBaseEntity })
  findOne(@Param('id') id: number) {
    return this.knowledgeBaseService.findOne(id);
  }

  /**
   * 更新知识库
   */
  @Patch(':id')
  @ApiOkResponse({ type: KnowledgeBaseEntity })
  @Permissions('system:knowledgeBase:update')
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateKnowledgeBaseDto: UpdateKnowledgeBaseDto,
  ) {
    return this.knowledgeBaseService.update(id, user, updateKnowledgeBaseDto);
  }

  /**
   * 删除知识库
   */
  @Delete(':id')
  @Permissions('system:knowledgeBase:delete')
  remove(@Param('id') id: number) {
    return this.knowledgeBaseService.remove(id);
  }
}
