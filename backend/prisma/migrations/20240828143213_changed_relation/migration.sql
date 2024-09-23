/*
  Warnings:

  - You are about to drop the column `adminId` on the `ProductInfo` table. All the data in the column will be lost.
  - The `productFilePath` column on the `ProductInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `adminUsername` to the `ProductInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductInfo" DROP CONSTRAINT "ProductInfo_adminId_fkey";

-- AlterTable
ALTER TABLE "ProductInfo" DROP COLUMN "adminId",
ADD COLUMN     "adminUsername" TEXT NOT NULL,
DROP COLUMN "productFilePath",
ADD COLUMN     "productFilePath" JSONB[];

-- AddForeignKey
ALTER TABLE "ProductInfo" ADD CONSTRAINT "ProductInfo_adminUsername_fkey" FOREIGN KEY ("adminUsername") REFERENCES "Admin"("userName") ON DELETE RESTRICT ON UPDATE CASCADE;
