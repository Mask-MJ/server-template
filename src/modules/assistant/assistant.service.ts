import { ConflictException, Inject, Injectable } from '@nestjs/common';
import {
  CreateAssistantDto,
  QueryAssistantDto,
  UpdateAssistantDto,
} from './assistant.dto';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/common/datebase/prisma.extension';

interface RagflowAssistantResponse {
  code: number;
  data: {
    name: string;
    avatar: string;
    dataset_ids: string[];
    id: string;
    description: string;
    do_refer: string;
    llm: {
      frequency_penalty: number;
      model_name: string;
      presence_penalty: number;
      temperature: number;
      top_p: number;
    };
    prompt: {
      empty_response: string;
      keywords_similarity_weight: number;
      opener: string;
      prompt: string;
      rerank_model: string;
      similarity_threshold: number;
      top_n: number;
    };
    prompt_type: string;
    tenant_id: string;
    top_k: number;
  };
  message: string;
}

@Injectable()
export class AssistantService {
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

  async create(user: ActiveUserData, createAssistantDto: CreateAssistantDto) {
    const { name } = createAssistantDto;
    const response =
      await this.httpService.axiosRef.post<RagflowAssistantResponse>(
        `${this.ragflowHost}/api/v1/chats`,
        { name },
        { headers: { Authorization: `Bearer ${this.ragflow_apiKey}` } },
      );
    if (response.data.code === 0) {
      const { name, avatar, llm, prompt, id, top_k } = response.data.data;
      return await this.prisma.client.assistant.create({
        data: {
          name,
          avatar,
          ...llm,
          empty_response: prompt.empty_response,
          keywords_similarity_weight: prompt.keywords_similarity_weight,
          opener: prompt.opener,
          prompt: prompt.prompt,
          similarity_threshold: prompt.similarity_threshold,
          top_n: prompt.top_n,
          top_k,
          assistantId: id,
          userId: user.sub,
        },
      });
    } else {
      throw new ConflictException(`创建聊天助手失败, ${response.data.message}`);
    }
  }

  async findAll(user: ActiveUserData, queryAssistantDto: QueryAssistantDto) {
    const { name } = queryAssistantDto;
    const userData = await this.prisma.client.user.findUniqueOrThrow({
      where: { id: user.sub },
      include: { dept: true },
    });
    if (userData.isAdmin) {
      return await this.prisma.client.assistant.findMany({
        where: { name: { contains: name, mode: 'insensitive' } },
      });
    } else {
      return await this.prisma.client.assistant.findMany({
        where: {
          name: { contains: name, mode: 'insensitive' },
          userId: user.sub,
        },
      });
    }
  }

  async findOne(id: number) {
    return await this.prisma.client.assistant.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(user: ActiveUserData, updateAssistantDto: UpdateAssistantDto) {
    const {
      name,
      avatar,
      model_name,
      frequency_penalty,
      max_tokens,
      presence_penalty,
      temperature,
      top_p,
      empty_response,
      opener,
      keywords_similarity_weight,
      prompt,
      similarity_threshold,
      top_n,
      top_k,
    } = updateAssistantDto;
    const response =
      await this.httpService.axiosRef.post<RagflowAssistantResponse>(
        `${this.ragflowHost}/api/v1/chats`,
        {
          name,
          avatar,
          llm: {
            model_name,
            frequency_penalty,
            max_tokens,
            presence_penalty,
            temperature,
            top_p,
          },
          prompt: {
            empty_response,
            keywords_similarity_weight,
            opener,
            prompt,
            similarity_threshold,
            top_n,
          },
          top_k,
        },
        { headers: { Authorization: `Bearer ${this.ragflow_apiKey}` } },
      );
    console.log(response.data);
    if (response.data.code === 0) {
      return await this.prisma.client.assistant.create({
        data: {
          ...updateAssistantDto,
          assistantId: response.data.data.id,
          userId: user.sub,
        },
      });
    } else {
      throw new ConflictException(`更新聊天助手失败, ${response.data.message}`);
    }
  }

  async remove(id: number) {
    const assistant = await this.prisma.client.assistant.findUniqueOrThrow({
      where: { id },
    });
    const response = await this.httpService.axiosRef.delete(
      `${this.ragflowHost}/api/v1/chats`,
      {
        headers: { Authorization: `Bearer ${this.ragflow_apiKey}` },
        params: { ids: [assistant.assistantId] },
      },
    );
    if (response.data.code === 0) {
      return await this.prisma.client.assistant.delete({ where: { id } });
    } else {
      throw new ConflictException(`删除聊天助手失败, ${response.data.message}`);
    }
  }
}
