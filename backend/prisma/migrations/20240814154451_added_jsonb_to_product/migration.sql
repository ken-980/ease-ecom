/*
  Warnings:

  - Changed the type of `productFilePath` on the `ProductInfo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ProductInfo" DROP COLUMN "productFilePath",
ADD COLUMN     "productFilePath" JSONB NOT NULL;
