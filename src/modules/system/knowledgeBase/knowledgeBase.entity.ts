import { KnowledgeBase, ChunkMethod } from '@prisma/client';

export class KnowledgeBaseEntity implements KnowledgeBase {
  id: number;
  name: string;
  avatar: string;
  description: string;
  embedding_model: string;
  permission: string;
  chunk_method: ChunkMethod;
  parser_config: string;
  datasetId: string | null;
  order: number;
  createBy: string;
  updateBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}
