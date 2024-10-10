/*
  Warnings:

  - Added the required column `imagePublicId` to the `ProductInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductInfo" ADD COLUMN     "imagePublicId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ProductPublicId" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,

    CONSTRAINT "ProductPublicId_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductPublicId_publicId_key" ON "ProductPublicId"("publicId");

-- AddForeignKey
ALTER TABLE "ProductInfo" ADD CONSTRAINT "ProductInfo_imagePublicId_fkey" FOREIGN KEY ("imagePublicId") REFERENCES "ProductPublicId"("publicId") ON DELETE RESTRICT ON UPDATE CASCADE;
