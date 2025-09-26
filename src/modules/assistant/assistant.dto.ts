import { PartialType, IntersectionType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAssistantDto {
  /**
   * 助手名称
   * @example '助手1'
   * */
  @IsString()
  name: string;

  /**
   * 助手头像
   * @example 'https://example.com/avatar.png'
   * */
  @IsString()
  @IsOptional()
  avatar?: string;

  /**
   * LLM
   * @example 'gpt-3.5-turbo'
   * */
  @IsString()
  @IsOptional()
  model_name: string = 'deepseek-r1@Tongyi-Qianwen';

  /**
   * 温度
   * @example 0.7
   * */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  temperature?: number = 0.1;

  /**
   * 最大生成长度
   * @example 512
   * */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  max_tokens?: number = 512;

  /**
   * 核心采样
   * @example 0.3
   * */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  top_p?: number = 0.3;

  /**
   * 存在惩罚
   * @example 0.4
   * */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  presence_penalty?: number = 0.4;

  /**
   * 频率惩罚
   * @example 0.7
   * */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  frequency_penalty?: number = 0.7;

  /**
   * 加权关键字相似度
   * @example 0.2
   * */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  similarity_threshold?: number = 0.2;

  /**
   * 关键词相似度权重
   * @example 0.7
   * */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  keywords_similarity_weight?: number = 0.7;

  /**
   * 生成的回复数量
   * @example 6
   * */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  top_n?: number = 6;

  /**
   * 重新排序或选择前 k 个项目
   * @example 1024
   * */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  top_k?: number = 1024;

  /**
   * 空响应返回内容
   * @example '无'
   * */
  @IsString()
  @IsOptional()
  empty_response?: string;

  /**
   * 开场问候语
   * @example '你好，我是你的助手。'
   * */
  @IsString()
  @IsOptional()
  opener?: string;

  /**
   * 提示词模板
   * @example '<prompt>'
   * */
  @IsString()
  @IsOptional()
  prompt?: string;
}

export class QueryAssistantDto extends PartialType(
  IntersectionType(PickType(CreateAssistantDto, ['name'])),
) {}

export class UpdateAssistantDto extends CreateAssistantDto {
  @IsNumber()
  @Type(() => Number)
  id: number;
}

export class CreateSessionDto {
  /** * 会话名称
   * @example '会话1'
   * */
  @IsString()
  @IsOptional()
  name?: string;
}

export class QuerySessionDto {
  /** * 会话名称
   * @example '会话1'
   * */
  @IsString()
  @IsOptional()
  name?: string;
}

export class UpdateSessionDto extends CreateSessionDto {
  @IsString()
  id: string;
}

export class CreateCompletionsDto {
  /**
   * 开始人工智能对话的问题
   * @example '你好'
   * */
  @IsString()
  question: string;

  /**
   * 是否开启流式响应
   * @example true
   * */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  stream?: boolean;

  /**
   * 会话ID
   * @example '会话1'
   * */
  @IsString()
  @IsOptional()
  session_id: string;
}
