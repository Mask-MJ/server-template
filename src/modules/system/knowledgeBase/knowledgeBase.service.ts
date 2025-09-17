import {
  ConflictException,
  Inject,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import {
  CreateKnowledgeBaseDto,
  QueryKnowledgeBaseDto,
  UpdateKnowledgeBaseDto,
  UpdateDocumentDto,
} from './knowledgeBase.dto';
import { PrismaService } from '@/common/datebase/prisma.extension';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KnowledgeBaseService {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
    @Inject(HttpService) private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async create(
    user: ActiveUserData,
    createKnowledgeBaseDto: CreateKnowledgeBaseDto,
  ) {
    const { name, permission } = createKnowledgeBaseDto;
    const userData = await this.prisma.client.user.findUniqueOrThrow({
      where: { id: user.sub },
      include: { dept: true },
    });
    const ragflowHost = this.configService.get<string>('RAGFLOW_HOST', '');
    const ragflow_apiKey = this.configService.get<string>('RAGFLOW_APIKEY', '');

    const response = await this.httpService.axiosRef.post(
      `${ragflowHost}/api/v1/datasets`,
      { name },
      { headers: { Authorization: `Bearer ${ragflow_apiKey}` } },
    );
    if (response.data.code === 0) {
      return await this.prisma.client.knowledgeBase.create({
        data: {
          ...createKnowledgeBaseDto,
          deptId: permission === 'team' ? userData.deptId : null,
          datasetId: response.data.data.id,
          createBy: user.username,
        },
      });
    } else {
      throw new ConflictException(`创建知识库失败, ${response.data.message}`);
    }
  }

  async findAll(
    user: ActiveUserData,
    queryKnowledgeBaseDto: QueryKnowledgeBaseDto,
  ) {
    const { name } = queryKnowledgeBaseDto;
    const userData = await this.prisma.client.user.findUniqueOrThrow({
      where: { id: user.sub },
      include: { dept: true },
    });
    if (userData.isAdmin) {
      return await this.prisma.client.knowledgeBase.findMany({
        where: { name: { contains: name, mode: 'insensitive' } },
      });
    } else {
      return await this.prisma.client.knowledgeBase.findMany({
        where: {
          name: { contains: name, mode: 'insensitive' },
          OR: [{ createBy: userData.username }, { deptId: userData.dept?.id }],
        },
      });
    }
  }

  async findOne(id: number) {
    return await this.prisma.client.knowledgeBase.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(
    id: number,
    user: ActiveUserData,
    updateKnowledgeBaseDto: UpdateKnowledgeBaseDto,
  ) {
    return await this.prisma.client.knowledgeBase.update({
      where: { id },
      data: { ...updateKnowledgeBaseDto, updateBy: user.username },
    });
  }

  async remove(id: number) {
    return await this.prisma.client.knowledgeBase.delete({ where: { id } });
  }

  async uploadDocument(id: string, files: Array<Express.Multer.File>) {
    const ragflowHost = this.configService.get<string>('RAGFLOW_HOST', '');
    const ragflow_apiKey = this.configService.get<string>('RAGFLOW_APIKEY', '');
    // File -> blob
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(
        'file',
        new Blob([new Uint8Array(file.buffer)]),
        file.originalname,
      );
    });

    const response = await this.httpService.axiosRef.post(
      `${ragflowHost}/api/v1/datasets/${id}/documents`,
      formData,
      { headers: { Authorization: `Bearer ${ragflow_apiKey}` } },
    );
    if (response.data.code !== 0) {
      throw new ConflictException(
        `上传知识库文件失败, ${response.data.message}`,
      );
    }
    return response.data.data;
  }

  async updateDocument(
    id: string,
    document_id: string,
    updateDocumentDto: UpdateDocumentDto,
  ) {
    const ragflowHost = this.configService.get<string>('RAGFLOW_HOST', '');
    const ragflow_apiKey = this.configService.get<string>('RAGFLOW_APIKEY', '');
    const response = await this.httpService.axiosRef.patch(
      `${ragflowHost}/api/v1/datasets/${id}/documents/${document_id}`,
      updateDocumentDto,
      { headers: { Authorization: `Bearer ${ragflow_apiKey}` } },
    );
    if (response.data.code !== 0) {
      throw new ConflictException(
        `更新知识库文件失败, ${response.data.message}`,
      );
    }
    return response.data.data;
  }

  async downloadDocument(id: string, document_id: string) {
    const ragflowHost = this.configService.get<string>('RAGFLOW_HOST', '');
    const ragflow_apiKey = this.configService.get<string>('RAGFLOW_APIKEY', '');

    const response = await this.httpService.axiosRef.get(
      `${ragflowHost}/api/v1/datasets/${id}/documents/${document_id}`,
      {
        headers: { Authorization: `Bearer ${ragflow_apiKey}` },
        responseType: 'arraybuffer',
      },
    );

    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? decodeURIComponent(
          (contentDisposition.match(/filename\*?=(?:UTF-8'')?([^;]+)/) ||
            [])[1] || 'unknown',
        ).replace(/['"]/g, '')
      : 'unknown';
    return new StreamableFile(response.data, {
      disposition: `attachment; filename="${filename}"`,
      type: response.headers['content-type'],
    });
  }

  async removeDocument(id: string, ids: string[]) {
    const ragflowHost = this.configService.get<string>('RAGFLOW_HOST', '');
    const ragflow_apiKey = this.configService.get<string>('RAGFLOW_APIKEY', '');
    const ragFlowDatasets = await this.httpService.axiosRef.delete(
      `${ragflowHost}/api/v1/datasets/${id}/documents`,
      { headers: { Authorization: `Bearer ${ragflow_apiKey}` }, data: { ids } },
    );
    if (ragFlowDatasets.data.code !== 0) {
      throw new ConflictException(
        `删除知识库文件失败, ${ragFlowDatasets.data.message}`,
      );
    }
    return ragFlowDatasets.data.data;
  }

  async parseDocument(id: string, document_ids: string[]) {
    const ragflowHost = this.configService.get<string>('RAGFLOW_HOST', '');
    const ragflow_apiKey = this.configService.get<string>('RAGFLOW_APIKEY', '');
    const ragFlowDatasets = await this.httpService.axiosRef.post(
      `${ragflowHost}/api/v1/datasets/${id}/documents/chunks`,
      { document_ids },
      { headers: { Authorization: `Bearer ${ragflow_apiKey}` } },
    );
    if (ragFlowDatasets.data.code !== 0) {
      throw new ConflictException(
        `解析知识库文件失败, ${ragFlowDatasets.data.message}`,
      );
    }
    return ragFlowDatasets.data.data;
  }

  async stopParseDocument(id: string, document_ids: string[]) {
    const ragflowHost = this.configService.get<string>('RAGFLOW_HOST', '');
    const ragflow_apiKey = this.configService.get<string>('RAGFLOW_APIKEY', '');
    return this.httpService.axiosRef.delete(
      `${ragflowHost}/api/v1/datasets/${id}/documents/chunks`,
      {
        headers: { Authorization: `Bearer ${ragflow_apiKey}` },
        data: { document_ids },
      },
    );
  }
}
