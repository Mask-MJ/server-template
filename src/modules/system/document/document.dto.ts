import { IsOptional, IsString } from 'class-validator';

export class UploadDocumentDto {
  /**
   * 知识库ID
   * @example '78e5ae6691db11f084d3fa341edb7c4d'
   */
  @IsString()
  kb_id: string;
}

export class QueryDocumentDto extends UploadDocumentDto {
  /**
   * 文件名称
   * @example '技术文档'
   */
  @IsString()
  @IsOptional()
  name?: string;
}

export class UpdateDocumentDto extends UploadDocumentDto {
  /**
   * 文件名称
   * @example '技术文档'
   */
  @IsString()
  @IsOptional()
  name?: string;
}
