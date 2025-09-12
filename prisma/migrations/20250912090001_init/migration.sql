-- CreateEnum
CREATE TYPE "ChunkMethod" AS ENUM ('naive', 'book', 'email', 'laws', 'manual', 'one', 'paper', 'picture', 'presentation', 'qa', 'table', 'tag');

-- CreateTable
CREATE TABLE "KnowledgeBase" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "description" TEXT,
    "embedding_model" TEXT NOT NULL,
    "permission" TEXT,
    "chunk_method" "ChunkMethod" NOT NULL DEFAULT 'naive',
    "parser_config" JSONB,
    "order" INTEGER NOT NULL DEFAULT 1,
    "createBy" TEXT NOT NULL,
    "updateBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeBase_pkey" PRIMARY KEY ("id")
);
