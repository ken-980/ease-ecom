/*
  Warnings:

  - Changed the type of `imagePublicId` on the `ProductInfo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ProductInfo" DROP CONSTRAINT "ProductInfo_imagePublicId_fkey";

-- AlterTable
ALTER TABLE "ProductInfo" DROP COLUMN "imagePublicId",
ADD COLUMN     "imagePublicId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductInfo_imagePublicId_key" ON "ProductInfo"("imagePublicId");
