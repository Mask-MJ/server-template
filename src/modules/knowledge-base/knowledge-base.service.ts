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
  QueryDocumentDto,
} from './knowledge-base.dto';
import { PrismaService } from '@/common/datebase/prisma.extension';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KnowledgeBaseService {
  private ragflowHost: string;
  private ragflow_apiKey: string;
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
    @Inject(HttpService) private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.ragflowHost = configService.get<string>('RAGFLOW_HOST', '');
    this.ragflow_apiKey = configService.get<string>('RAGFLOW_APIKEY', '');
  }

  async create(
    user: ActiveUserData,
    createKnowledgeBaseDto: CreateKnowledgeBaseDto,
  ) {
    const { name, permission } = createKnowledgeBaseDto;
    const userData = await this.prisma.client.user.findUniqueOrThrow({
      where: { id: user.sub },
      include: { dept: true },
    });

    const response = await this.httpService.axiosRef.post(
      `${this.ragflowHost}/api/v1/datasets`,
      { name },
      { headers: { Authorization: `Bearer ${this.ragflow_apiKey}` } },
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
    user: ActiveUserData,
    updateKnowledgeBaseDto: UpdateKnowledgeBaseDto,
  ) {
    // console.log('updateKnowledgeBaseDto', updateKnowledgeBaseDto);
    const { id, order, ...rest } = updateKnowledgeBaseDto;
    const knowledgeBase =
      await this.prisma.client.knowledgeBase.findUniqueOrThrow({
        where: { id },
      });
    const response = await this.httpService.axiosRef.put(
      `${this.ragflowHost}/api/v1/datasets/${knowledgeBase.datasetId}`,
      rest,
      { headers: { Authorization: `Bearer ${this.ragflow_apiKey}` } },
    );
    if (response.data.code === 0) {
      return await this.prisma.client.knowledgeBase.update({
        where: { id },
        data: { ...updateKnowledgeBaseDto, order, updateBy: user.username },
      });
    } else {
      throw new ConflictException(`更新知识库失败, ${response.data.message}`);
    }
  }

  async remove(id: number) {
    const knowledgeBase =
      await this.prisma.client.knowledgeBase.findUniqueOrThrow({
        where: { id },
      });
    const ragFlowDatasets = await this.httpService.axiosRef.delete(
      `${this.ragflowHost}/api/v1/datasets`,
      {
        headers: { Authorization: `Bearer ${this.ragflow_apiKey}` },
        params: { ids: [knowledgeBase.datasetId] },
      },
    );
    if (ragFlowDatasets.data.code !== 0) {
      throw new ConflictException(
        `删除知识库失败, ${ragFlowDatasets.data.message}`,
      );
    }
    return await this.prisma.client.knowledgeBase.delete({ where: { id } });
  }

  async findAllDocument(id: number, queryDocumentDto: QueryDocumentDto) {
    console.log('queryDocumentDto', id, queryDocumentDto);
    const knowledgeBase =
      await this.prisma.client.knowledgeBase.findUniqueOrThrow({
        where: { id },
      });
    const response = await this.httpService.axiosRef.get(
      `${this.ragflowHost}/api/v1/datasets/${knowledgeBase.datasetId}/documents`,
      {
        headers: { Authorization: `Bearer ${this.ragflow_apiKey}` },
        params: {
          ...queryDocumentDto,
          page: 1,
          page_size: 100000,
        },
      },
    );
    if (response.data.code !== 0) {
      throw new ConflictException(
        `更新知识库文件失败, ${response.data.message}`,
      );
    }
    return response.data.data.docs.map((item) => ({
      ...item,
      createdAt: item.create_date,
      updatedAt: item.update_date,
    }));
  }

  async uploadDocument(id: string, files: Array<Express.Multer.File>) {
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
      `${this.ragflowHost}/api/v1/datasets/${id}/documents`,
      formData,
      { headers: { Authorization: `Bearer ${this.ragflow_apiKey}` } },
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
    const response = await this.httpService.axiosRef.patch(
      `${this.ragflowHost}/api/v1/datasets/${id}/documents/${document_id}`,
      updateDocumentDto,
      { headers: { Authorization: `Bearer ${this.ragflow_apiKey}` } },
    );
    if (response.data.code !== 0) {
      throw new ConflictException(
        `更新知识库文件失败, ${response.data.message}`,
      );
    }
    return response.data.data;
  }

  async downloadDocument(id: string, document_id: string) {
    const response = await this.httpService.axiosRef.get(
      `${this.ragflowHost}/api/v1/datasets/${id}/documents/${document_id}`,
      {
        headers: { Authorization: `Bearer ${this.ragflow_apiKey}` },
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
    const ragFlowDatasets = await this.httpService.axiosRef.delete(
      `${this.ragflowHost}/api/v1/datasets/${id}/documents`,
      {
        headers: { Authorization: `Bearer ${this.ragflow_apiKey}` },
        data: { ids },
      },
    );
    if (ragFlowDatasets.data.code !== 0) {
      throw new ConflictException(
        `删除知识库文件失败, ${ragFlowDatasets.data.message}`,
      );
    }
    return ragFlowDatasets.data.data;
  }

  async parseDocument(id: string, document_ids: string[]) {
    const ragFlowDatasets = await this.httpService.axiosRef.post(
      `${this.ragflowHost}/api/v1/datasets/${id}/documents/chunks`,
      { document_ids },
      { headers: { Authorization: `Bearer ${this.ragflow_apiKey}` } },
    );
    if (ragFlowDatasets.data.code !== 0) {
      throw new ConflictException(
        `解析知识库文件失败, ${ragFlowDatasets.data.message}`,
      );
    }
    return ragFlowDatasets.data.data;
  }

  async stopParseDocument(id: string, document_ids: string[]) {
    return this.httpService.axiosRef.delete(
      `${this.ragflowHost}/api/v1/datasets/${id}/documents/chunks`,
      {
        headers: { Authorization: `Bearer ${this.ragflow_apiKey}` },
        data: { document_ids },
      },
    );
  }
}
