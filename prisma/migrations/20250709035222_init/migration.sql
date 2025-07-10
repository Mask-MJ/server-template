/*
  Warnings:

  - You are about to drop the column `createBy` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `remark` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Menu` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "createBy",
DROP COLUMN "createdAt",
DROP COLUMN "remark",
DROP COLUMN "updateBy",
DROP COLUMN "updatedAt";
