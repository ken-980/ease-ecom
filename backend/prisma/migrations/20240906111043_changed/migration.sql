/*
  Warnings:

  - Changed the type of `productQuantity` on the `ProductInfo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ProductInfo" DROP COLUMN "productQuantity",
ADD COLUMN     "productQuantity" INTEGER NOT NULL;
