import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

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
  description: string = '';

  /**
   * 嵌入模型
   * @example 'text-embedding-ada-002'
   */
  @IsString()
  @IsOptional()
  embedding_model: string = 'text-embedding-v4@Tongyi-Qianwen';

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
  @IsOptional()
  chunk_method?: string = 'naive';

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
  @Type(() => Number)
  id: number;
}

export class QueryDocumentDto {
  /**
   * 文档名称
   * @example '文档1'
   */
  @IsString()
  @IsOptional()
  name?: string;
}

export class UpdateDocumentDto {
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
  @IsOptional()
  chunk_method?: string = 'naive';

  /**
   * 数据集分析器的配置设置
   * @example {"max_tokens": 1024, "temperature": 0.5}
   */
  @IsObject()
  @IsOptional()
  parser_config?: object;
}

export class DeleteDocumentDto {
  /**
   * 文件ID
   * @example ['78e5ae6691db11f084d3fa341edb7c4d', '78e5ae6691db11f084d3fa341edb7c4e']
   */
  @IsString({ each: true })
  document_ids: string[];
}

export class ParseDocumentDto extends DeleteDocumentDto {}
