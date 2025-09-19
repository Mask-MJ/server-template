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
import { AssistantService } from './assistant.service';
import {
  CreateAssistantDto,
  QueryAssistantDto,
  UpdateAssistantDto,
} from './assistant.dto';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { Permissions } from 'src/modules/auth/authorization/decorators/permissions.decorator';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { AssistantEntity } from './assistant.entity';

@ApiTags('聊天助手管理')
@ApiBearerAuth('bearer')
@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}
  /**
   * 创建聊天助手
   */
  @Post()
  @Permissions('assistant:create')
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createAssistantDto: CreateAssistantDto,
  ) {
    return this.assistantService.create(user, createAssistantDto);
  }

  /**
   * 获取聊天助手列表
   */
  @Get()
  @ApiOkResponse({ type: AssistantEntity, isArray: true })
  findAll(
    @ActiveUser() user: ActiveUserData,
    @Query() queryAssistantDto: QueryAssistantDto,
  ) {
    return this.assistantService.findAll(user, queryAssistantDto);
  }

  /**
   * 获取聊天助手详情
   */
  @Get(':id')
  @ApiOkResponse({ type: AssistantEntity })
  findOne(@Param('id') id: number) {
    return this.assistantService.findOne(+id);
  }

  /**
   * 更新聊天助手
   */
  @Patch(':id')
  @ApiOkResponse({ type: AssistantEntity })
  @Permissions('assistant:update')
  update(
    @ActiveUser() user: ActiveUserData,
    @Body() updateAssistantDto: UpdateAssistantDto,
  ) {
    return this.assistantService.update(user, updateAssistantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.assistantService.remove(id);
  }
}
