-- CreateEnum
CREATE TYPE "public"."AssignedStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."DispatchMode" AS ENUM ('BROADCAST', 'TARGETED');

-- AlterTable
ALTER TABLE "public"."RequestForQuote" ADD COLUMN     "dispatchMode" "public"."DispatchMode" NOT NULL DEFAULT 'BROADCAST';

-- CreateTable
CREATE TABLE "public"."AssignedDriver" (
    "id" TEXT NOT NULL,
    "rfqId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "status" "public"."AssignedStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "AssignedDriver_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."AssignedDriver" ADD CONSTRAINT "AssignedDriver_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "public"."RequestForQuote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssignedDriver" ADD CONSTRAINT "AssignedDriver_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public"."Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
