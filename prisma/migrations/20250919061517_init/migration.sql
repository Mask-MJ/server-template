/*
  Warnings:

  - Added the required column `model_name` to the `Assistant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assistant" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "empty_response" TEXT,
ADD COLUMN     "keywords_similarity_weight" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
ADD COLUMN     "model_name" TEXT NOT NULL,
ADD COLUMN     "opener" TEXT,
ADD COLUMN     "presence_penalty" DOUBLE PRECISION NOT NULL DEFAULT 0.4,
ADD COLUMN     "prompt" TEXT,
ADD COLUMN     "similarity_threshold" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
ADD COLUMN     "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
ADD COLUMN     "top_k" INTEGER NOT NULL DEFAULT 1024,
ADD COLUMN     "top_n" INTEGER NOT NULL DEFAULT 6,
ADD COLUMN     "top_p" DOUBLE PRECISION NOT NULL DEFAULT 0.3;
