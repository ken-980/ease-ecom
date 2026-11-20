/*
  Warnings:

  - You are about to alter the column `productPrice` on the `ProductInfo` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - Added the required column `productBrand` to the `ProductInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductInfo" ADD COLUMN     "productBrand" TEXT NOT NULL,
ALTER COLUMN "productPrice" SET DATA TYPE DECIMAL(10,2);
