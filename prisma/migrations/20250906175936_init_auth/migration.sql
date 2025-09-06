/*
  Warnings:

  - A unique constraint covering the columns `[userId,reason]` on the table `OtpToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."OtpToken_token_key";

-- CreateIndex
CREATE UNIQUE INDEX "OtpToken_userId_reason_key" ON "public"."OtpToken"("userId", "reason");
