/*
  Warnings:

  - You are about to drop the column `leader` on the `Dept` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Dept" DROP COLUMN "leader",
ADD COLUMN     "leaderId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isDeptAdmin" BOOLEAN NOT NULL DEFAULT false;
