/*
  Warnings:

  - Made the column `note` on table `assemblies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "assemblies" ALTER COLUMN "note" SET NOT NULL;
