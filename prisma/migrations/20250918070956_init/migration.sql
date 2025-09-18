/*
  Warnings:

  - The `chunk_method` column on the `KnowledgeBase` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "KnowledgeBase" DROP COLUMN "chunk_method",
ADD COLUMN     "chunk_method" TEXT NOT NULL DEFAULT 'naive';

-- DropEnum
DROP TYPE "ChunkMethod";
