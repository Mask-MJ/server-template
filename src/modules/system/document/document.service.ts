import { ConflictException, Inject, Injectable } from '@nestjs/common';
import {
  QueryDocumentDto,
  UpdateDocumentDto,
  UploadDocumentDto,
} from './document.dto';
import { PrismaService } from '@/common/datebase/prisma.extension';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class DocumentService {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
    private configService: ConfigService,
    @Inject(HttpService) private httpService: HttpService,
  ) {}

  async upload(body: UploadDocumentDto, files: Array<Express.Multer.File>) {
    const ragflowHost = this.configService.get<string>('RAGFLOW_HOST', '');
    const ragflow_apiKey = this.configService.get<string>('RAGFLOW_APIKEY', '');
    // File -> blob
    const formData = new FormData();
    formData.append('kb_id', body.kb_id);
    files.forEach((file) => {
      formData.append(
        'file',
        new Blob([new Uint8Array(file.buffer)]),
        file.originalname,
      );
    });

    const ragFlowdocument = await this.httpService.axiosRef.post(
      `${ragflowHost}/api/v1/document/upload`,
      formData,
      { headers: { Authorization: `Bearer ${ragflow_apiKey}` } },
    );
    if (ragFlowdocument.data.code !== 0) {
      throw new ConflictException(
        `上传知识库文件失败, ${ragFlowdocument.data.message}`,
      );
    }
    return ragFlowdocument.data.data;
  }

  async findAll(queryDocumentDto: QueryDocumentDto) {
    const { kb_id, name: keywords } = queryDocumentDto;
    const ragflowHost = this.configService.get<string>('RAGFLOW_HOST', '');
    const ragflow_apiKey = this.configService.get<string>('RAGFLOW_APIKEY', '');
    const ragFlowdocument = await this.httpService.axiosRef.get(
      `${ragflowHost}/api/v1/datasets/${kb_id}/documents`,
      {
        headers: { Authorization: `Bearer ${ragflow_apiKey}` },
        params: { keywords, page_size: 100000 },
      },
    );
    if (ragFlowdocument.data.code !== 0) {
      throw new ConflictException(
        `查询知识库文件失败, ${ragFlowdocument.data.message}`,
      );
    }
    return ragFlowdocument.data.data;
  }

  async findOne(id: number) {
    return await this.prisma.client.dept.findUniqueOrThrow({ where: { id } });
  }

  async update(
    id: number,
    user: ActiveUserData,
    updateDocumentDto: UpdateDocumentDto,
  ) {}

  async remove(id: number) {
    return await this.prisma.client.dept.delete({ where: { id } });
  }
}
