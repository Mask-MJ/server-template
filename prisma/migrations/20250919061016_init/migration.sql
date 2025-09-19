/*
  Warnings:

  - You are about to drop the column `avatar` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `empty_response` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `keywords_similarity_weight` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `model_name` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `opener` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `presence_penalty` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `prompt` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `similarity_threshold` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `top_k` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `top_n` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `top_p` on the `Assistant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assistant" DROP COLUMN "avatar",
DROP COLUMN "empty_response",
DROP COLUMN "keywords_similarity_weight",
DROP COLUMN "model_name",
DROP COLUMN "opener",
DROP COLUMN "presence_penalty",
DROP COLUMN "prompt",
DROP COLUMN "similarity_threshold",
DROP COLUMN "temperature",
DROP COLUMN "top_k",
DROP COLUMN "top_n",
DROP COLUMN "top_p";
