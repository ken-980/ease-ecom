/*
  Warnings:

  - You are about to drop the column `imagePublicId` on the `ProductInfo` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ProductInfo_imagePublicId_key";

-- AlterTable
ALTER TABLE "ProductInfo" DROP COLUMN "imagePublicId";
