import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import {
  QueryDocumentDto,
  UpdateDocumentDto,
  UploadDocumentDto,
} from './document.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { ActiveUser } from '@/modules/auth/decorators/active-user.decorator';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import { DocumentEntity } from './document.entity';
import { Permissions } from 'src/modules/auth/authorization/decorators/permissions.decorator';
import { UploadDto } from '@/common/dto/base.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('文件管理')
@ApiBearerAuth('bearer')
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}
  /**
   * 上传文件
   */
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: DocumentEntity, isArray: true })
  @ApiBody({ description: '上传文件', type: UploadDto })
  @Permissions('system:knowledgeBase:create')
  @UseInterceptors(FilesInterceptor('files'))
  upload(
    @Body() body: UploadDocumentDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.documentService.upload(body, files);
  }

  /**
   * 获取文件列表
   */
  @Get()
  @ApiOkResponse({ type: DocumentEntity, isArray: true })
  findAll(@Query() queryDocumentDto: QueryDocumentDto) {
    return this.documentService.findAll(queryDocumentDto);
  }

  /**
   * 下载文件
   */
  @Get(':id')
  @ApiOkResponse({ type: DocumentEntity })
  download(@Param('id') id: number) {
    // return this.documentService.download(id);
  }

  /**
   * 更新文件信息
   */
  @Patch(':id')
  @ApiOkResponse({ type: DocumentEntity })
  @Permissions('system:document:update')
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentService.update(id, user, updateDocumentDto);
  }

  /**
   * 删除文件
   */
  @Delete(':id')
  @Permissions('system:document:delete')
  remove(@Param('id') id: number) {
    return this.documentService.remove(id);
  }
}
