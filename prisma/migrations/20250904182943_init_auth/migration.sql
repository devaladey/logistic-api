-- AlterTable
ALTER TABLE "public"."RefreshToken" ADD COLUMN     "appVersion" TEXT,
ADD COLUMN     "device" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "userAgent" TEXT;
