-- AlterTable
ALTER TABLE "KnowledgeBase" ADD COLUMN     "deptId" INTEGER;

-- AddForeignKey
ALTER TABLE "KnowledgeBase" ADD CONSTRAINT "KnowledgeBase_deptId_fkey" FOREIGN KEY ("deptId") REFERENCES "Dept"("id") ON DELETE CASCADE ON UPDATE CASCADE;
