/*
  Warnings:

  - Made the column `path` on table `Menu` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Menu" ALTER COLUMN "path" SET NOT NULL,
ALTER COLUMN "path" SET DEFAULT '';
