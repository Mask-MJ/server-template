/*
  Warnings:

  - You are about to drop the `AnalysisTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Factory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Unit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Valve` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ValveHistoryData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AnalysisTaskToValve` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FactoryToRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ValveToWorkOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnalysisTask" DROP CONSTRAINT "AnalysisTask_factoryId_fkey";

-- DropForeignKey
ALTER TABLE "Factory" DROP CONSTRAINT "Factory_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Unit" DROP CONSTRAINT "Unit_factoryId_fkey";

-- DropForeignKey
ALTER TABLE "Valve" DROP CONSTRAINT "Valve_factoryId_fkey";

-- DropForeignKey
ALTER TABLE "Valve" DROP CONSTRAINT "Valve_unitId_fkey";

-- DropForeignKey
ALTER TABLE "ValveHistoryData" DROP CONSTRAINT "ValveHistoryData_valveId_fkey";

-- DropForeignKey
ALTER TABLE "WorkOrder" DROP CONSTRAINT "WorkOrder_factoryId_fkey";

-- DropForeignKey
ALTER TABLE "_AnalysisTaskToValve" DROP CONSTRAINT "_AnalysisTaskToValve_A_fkey";

-- DropForeignKey
ALTER TABLE "_AnalysisTaskToValve" DROP CONSTRAINT "_AnalysisTaskToValve_B_fkey";

-- DropForeignKey
ALTER TABLE "_FactoryToRole" DROP CONSTRAINT "_FactoryToRole_A_fkey";

-- DropForeignKey
ALTER TABLE "_FactoryToRole" DROP CONSTRAINT "_FactoryToRole_B_fkey";

-- DropForeignKey
ALTER TABLE "_ValveToWorkOrder" DROP CONSTRAINT "_ValveToWorkOrder_A_fkey";

-- DropForeignKey
ALTER TABLE "_ValveToWorkOrder" DROP CONSTRAINT "_ValveToWorkOrder_B_fkey";

-- DropTable
DROP TABLE "AnalysisTask";

-- DropTable
DROP TABLE "Factory";

-- DropTable
DROP TABLE "Unit";

-- DropTable
DROP TABLE "Valve";

-- DropTable
DROP TABLE "ValveHistoryData";

-- DropTable
DROP TABLE "WorkOrder";

-- DropTable
DROP TABLE "_AnalysisTaskToValve";

-- DropTable
DROP TABLE "_FactoryToRole";

-- DropTable
DROP TABLE "_ValveToWorkOrder";
