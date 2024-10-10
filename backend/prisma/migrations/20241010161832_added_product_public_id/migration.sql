/*
  Warnings:

  - A unique constraint covering the columns `[imagePublicId]` on the table `ProductInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductInfo_imagePublicId_key" ON "ProductInfo"("imagePublicId");
