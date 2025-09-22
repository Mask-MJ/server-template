import { Assistant } from '@prisma/client';

export class AssistantEntity implements Assistant {
  id: number;
  name: string;
  avatar: string | null;
  model_name: string;
  temperature: number;
  top_p: number;
  presence_penalty: number;
  frequency_penalty: number;
  similarity_threshold: number;
  keywords_similarity_weight: number;
  top_n: number;
  top_k: number;
  empty_response: string | null;
  opener: string | null;
  prompt: string | null;
  assistantId: string | null;
  max_tokens: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

export class SessionEntity {
  id: string;
  name: string;
  chat_id: string;
  assistantId: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  messages: {
    content: string;
    role: string;
  }[];
}
