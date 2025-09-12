import { Inject, Injectable } from '@nestjs/common';
import {
  CreateKnowledgeBaseDto,
  QueryKnowledgeBaseDto,
  UpdateKnowledgeBaseDto,
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
    const knowledgeBase = await this.prisma.client.knowledgeBase.create({
      data: { ...createKnowledgeBaseDto, createBy: user.username },
    });

    const ragflowHost = this.configService.get<string>('RAGFLOW_HOST', '');
    const ragflow_apiKey = this.configService.get<string>('RAGFLOW_APIKEY', '');

    const ragFlowDatasets = await this.httpService.axiosRef.post(
      `${ragflowHost}/api/v1/datasets`,
      {
        name: knowledgeBase.name,
        description: knowledgeBase.description,
        embedding_model: knowledgeBase.embedding_model,
        chunk_method: knowledgeBase.chunk_method,
        parser_config: knowledgeBase.parser_config,
      },
      { headers: { Authorization: `Bearer ${ragflow_apiKey}` } },
    );

    return knowledgeBase;
  }

  async findAll(queryKnowledgeBaseDto: QueryKnowledgeBaseDto) {
    // https://github.com/prisma/prisma/issues/3725
    // https://github.com/prisma/prisma/issues/4562
    const { name } = queryKnowledgeBaseDto;
    const depts = await this.prisma.client.dept.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
    });
    return depts;
  }

  async findOne(id: number) {
    return await this.prisma.client.dept.findUniqueOrThrow({ where: { id } });
  }

  async update(
    id: number,
    user: ActiveUserData,
    updateKnowledgeBaseDto: UpdateKnowledgeBaseDto,
  ) {
    return await this.prisma.client.dept.update({
      where: { id },
      data: { ...updateKnowledgeBaseDto, updateBy: user.username },
    });
  }

  async remove(id: number) {
    return await this.prisma.client.dept.delete({ where: { id } });
  }
}
