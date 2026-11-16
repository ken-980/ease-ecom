/*
  Warnings:

  - The primary key for the `OrderedItems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `order` on the `OrderedItems` table. All the data in the column will be lost.
  - You are about to drop the column `orderItemsId` on the `OrderedItems` table. All the data in the column will be lost.
  - You are about to drop the column `productInfoId` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `productFilePath` on the `ProductInfo` table. All the data in the column will be lost.
  - You are about to drop the `ProductMainPhoto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductPublicId` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `orderId` to the `OrderedItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `OrderedItems` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `productPrice` on the `ProductInfo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- DropForeignKey
ALTER TABLE "OrderedItems" DROP CONSTRAINT "OrderedItems_order_fkey";

-- DropForeignKey
ALTER TABLE "ProductInfo" DROP CONSTRAINT "ProductInfo_adminUsername_fkey";

-- DropForeignKey
ALTER TABLE "ProductMainPhoto" DROP CONSTRAINT "ProductMainPhoto_productId_fkey";

-- DropIndex
DROP INDEX "OrderedItems_order_key";

-- DropIndex
DROP INDEX "Orders_customerId_key";

-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "OrderedItems" DROP CONSTRAINT "OrderedItems_pkey",
DROP COLUMN "order",
DROP COLUMN "orderItemsId",
ADD COLUMN     "orderId" INTEGER NOT NULL,
ADD COLUMN     "orderItemId" SERIAL NOT NULL,
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL,
ADD CONSTRAINT "OrderedItems_pkey" PRIMARY KEY ("orderItemId");

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "productInfoId",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "totalAmount" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ProductInfo" DROP COLUMN "productFilePath",
DROP COLUMN "productPrice",
ADD COLUMN     "productPrice" DECIMAL(65,30) NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "ProductMainPhoto";

-- DropTable
DROP TABLE "ProductPublicId";

-- CreateTable
CREATE TABLE "ProductMedia" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductMedia_publicId_key" ON "ProductMedia"("publicId");

-- AddForeignKey
ALTER TABLE "ProductInfo" ADD CONSTRAINT "ProductInfo_adminUsername_fkey" FOREIGN KEY ("adminUsername") REFERENCES "Admin"("userName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMedia" ADD CONSTRAINT "ProductMedia_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderedItems" ADD CONSTRAINT "OrderedItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("orderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderedItems" ADD CONSTRAINT "OrderedItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
