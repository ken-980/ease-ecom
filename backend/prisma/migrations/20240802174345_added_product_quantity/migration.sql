/*
  Warnings:

  - Added the required column `quantity` to the `ProductInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductInfo" ADD COLUMN     "quantity" INTEGER NOT NULL;
