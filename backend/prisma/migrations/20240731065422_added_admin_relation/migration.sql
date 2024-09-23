/*
  Warnings:

  - Added the required column `adminId` to the `ProductInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductInfo" ADD COLUMN     "adminId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductInfo" ADD CONSTRAINT "ProductInfo_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
