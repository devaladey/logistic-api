/*
  Warnings:

  - A unique constraint covering the columns `[userId,userAgent]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userAgent` on table `RefreshToken` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."RefreshToken" ALTER COLUMN "userAgent" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_userId_userAgent_key" ON "public"."RefreshToken"("userId", "userAgent");
