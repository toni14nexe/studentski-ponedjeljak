/*
  Warnings:

  - Added the required column `birthday` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" ADD COLUMN     "birthday" TEXT NOT NULL;
