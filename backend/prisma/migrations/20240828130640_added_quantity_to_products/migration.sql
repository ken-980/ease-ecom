/*
  Warnings:

  - Added the required column `productQuantity` to the `ProductInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductInfo" ADD COLUMN     "productQuantity" TEXT NOT NULL;
