import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Header,
} from '@nestjs/common';
import { AssistantService } from './assistant.service';
import {
  CreateAssistantDto,
  CreateCompletionsDto,
  CreateSessionDto,
  QueryAssistantDto,
  UpdateAssistantDto,
  UpdateSessionDto,
} from './assistant.dto';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { Permissions } from 'src/modules/auth/authorization/decorators/permissions.decorator';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { AssistantEntity, SessionEntity } from './assistant.entity';

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
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateAssistantDto: UpdateAssistantDto,
  ) {
    return this.assistantService.update(user, updateAssistantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.assistantService.remove(id);
  }

  /**
   * 创建与聊天助手的会话
   */
  @Post(':id/sessions')
  @Permissions('sessions:create')
  @ApiOkResponse({ type: SessionEntity })
  createSession(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() createSessionDto: CreateSessionDto,
  ) {
    return this.assistantService.createSession(id, user, createSessionDto);
  }

  /**
   * 更新与聊天助手的会话
   */
  @Patch(':id/sessions/:sessionId')
  @Permissions('sessions:update')
  @ApiOkResponse({ type: SessionEntity })
  updateSession(
    @Param('id') id: number,
    @Param('sessionId') sessionId: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return this.assistantService.updateSession(id, sessionId, updateSessionDto);
  }

  /**
   * 获取与聊天助手的会话列表
   */
  @Get(':id/sessions')
  @Permissions('sessions:read')
  @ApiOkResponse({ type: SessionEntity, isArray: true })
  findAllSessions(@Param('id') id: number, @ActiveUser() user: ActiveUserData) {
    return this.assistantService.findAllSessions(id, user);
  }

  /**
   * 删除与聊天助手的会话
   */
  @Delete(':id/sessions/:sessionId')
  @Permissions('sessions:delete')
  @ApiOkResponse({ type: SessionEntity })
  removeSession(
    @Param('id') id: number,
    @Param('sessionId') sessionId: string,
  ) {
    return this.assistantService.removeSession(id, sessionId);
  }

  /**
   * 向指定的聊天助手提问以开始 AI 驱动的对话
   */
  @Post(':id/completions')
  @Permissions('completions:create')
  @Header('Content-Type', 'text/event-stream')
  @Header('Cache-Control', 'no-cache')
  @Header('Connection', 'keep-alive')
  @ApiOkResponse({ type: SessionEntity })
  completions(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() createCompletions: CreateCompletionsDto,
  ) {
    return this.assistantService.createCompletions(id, user, createCompletions);
  }
}
