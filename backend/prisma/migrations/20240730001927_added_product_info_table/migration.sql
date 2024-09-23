-- CreateTable
CREATE TABLE "ProductInfo" (
    "id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "productGenderUse" TEXT NOT NULL,
    "productPrice" TEXT NOT NULL,
    "productFilePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductInfo_pkey" PRIMARY KEY ("id")
);
