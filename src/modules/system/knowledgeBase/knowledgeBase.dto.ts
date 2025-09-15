import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { ChunkMethod } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateKnowledgeBaseDto {
  /**
   * 知识库名称
   * @example '知识库1'
   */
  @IsString()
  name: string;

  /**
   * 排序
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  order?: number;

  /**
   * 知识库头像
   * @example 'https://example.com/avatar.png'
   */
  @IsString()
  @IsOptional()
  avatar?: string;

  /**
   * 描述
   * @example '这是一个知识库'
   */
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * 嵌入模型
   * @example 'text-embedding-ada-002'
   */
  @IsString()
  embedding_model: string;

  /**
   * 权限标识
   * @example 'me' | 'team
   */
  @IsString()
  @IsOptional()
  permission?: string;

  /**
   * 解析方法
   * @example 'naive'
   */
  @IsString()
  @IsEnum(ChunkMethod)
  @ApiProperty({ enum: ChunkMethod })
  chunk_method: ChunkMethod;

  /**
   * 数据集分析器的配置设置
   * @example {"max_tokens": 1024, "temperature": 0.5}
   */
  @IsObject()
  @IsOptional()
  parser_config?: object;
}

export class QueryKnowledgeBaseDto extends PartialType(
  IntersectionType(PickType(CreateKnowledgeBaseDto, ['name'])),
) {}

export class UpdateKnowledgeBaseDto extends PartialType(
  OmitType(CreateKnowledgeBaseDto, ['embedding_model']),
) {
  @IsNumber()
  id: number;
}

export class updateDocumentDto {
  /**
   * 文档名称
   * @example '文档1'
   */
  @IsString()
  @IsOptional()
  name?: string;

  /**
   * 文档元数据
   * @example {"author": "张三", "tags": ["tag1", "tag2"]}
   */
  @IsObject()
  @IsOptional()
  meta_fields?: object;

  /**
   * 解析方法
   * @example 'naive'
   */
  @IsString()
  @IsEnum(ChunkMethod)
  @IsOptional()
  @ApiProperty({ enum: ChunkMethod })
  chunk_method?: ChunkMethod;

  /**
   * 数据集分析器的配置设置
   * @example {"max_tokens": 1024, "temperature": 0.5}
   */
  @IsObject()
  @IsOptional()
  parser_config?: object;
}
