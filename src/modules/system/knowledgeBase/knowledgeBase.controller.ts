import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
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
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ActiveUser } from '@/modules/auth/decorators/active-user.decorator';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import { DocumentEntity, KnowledgeBaseEntity } from './knowledgeBase.entity';
import { Permissions } from 'src/modules/auth/authorization/decorators/permissions.decorator';
import { UploadDto } from '@/common/dto/base.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateDocumentDto } from '../document/document.dto';

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
  findAll(
    @ActiveUser() user: ActiveUserData,
    @Query() queryKnowledgeBaseDto: QueryKnowledgeBaseDto,
  ) {
    return this.knowledgeBaseService.findAll(user, queryKnowledgeBaseDto);
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

  /**
   * 上传文件到指定知识库
   */
  @Post(':id/documents')
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: DocumentEntity, isArray: true })
  @ApiBody({ description: '上传文件', type: UploadDto })
  @Permissions('system:knowledgeBase:create')
  @UseInterceptors(FilesInterceptor('files'))
  uploadDocument(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.knowledgeBaseService.uploadDocument(id, files);
  }

  /**
   * 更新知识库文件
   */
  @Patch(':id/documents/:document_id')
  @ApiOkResponse({ type: DocumentEntity })
  @Permissions('system:knowledgeBase:update')
  updateDocument(
    @Param('id') id: string,
    @Param('document_id') document_id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.knowledgeBaseService.updateDocument(
      id,
      document_id,
      updateDocumentDto,
    );
  }

  /**
   * 下载知识库文件
   */
  @Get(':id/documents/:document_id')
  @Permissions('system:knowledgeBase:download')
  downloadDocument(
    @Param('id') id: string,
    @Param('document_id') document_id: string,
  ) {
    return this.knowledgeBaseService.downloadDocument(id, document_id);
  }

  /**
   * 删除知识库文件
   */
  @Delete(':id/documents/:document_id')
  @Permissions('system:knowledgeBase:delete')
  removeDocument(
    @Param('id') id: string,
    @Param('document_id') document_id: string,
  ) {
    return this.knowledgeBaseService.removeDocument(id, document_id);
  }
}
