-- AlterTable
ALTER TABLE "Assistant" ADD COLUMN     "description" TEXT,
ADD COLUMN     "frequency_penalty" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
ADD COLUMN     "max_tokens" INTEGER NOT NULL DEFAULT 512;
