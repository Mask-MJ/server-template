/*
  Warnings:

  - You are about to drop the `_DeptToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DeptToUser" DROP CONSTRAINT "_DeptToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_DeptToUser" DROP CONSTRAINT "_DeptToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deptId" INTEGER;

-- DropTable
DROP TABLE "_DeptToUser";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_deptId_fkey" FOREIGN KEY ("deptId") REFERENCES "Dept"("id") ON DELETE SET NULL ON UPDATE CASCADE;
