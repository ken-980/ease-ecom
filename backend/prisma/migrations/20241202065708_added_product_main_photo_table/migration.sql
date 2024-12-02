-- CreateTable
CREATE TABLE "ProductMainPhoto" (
    "id" SERIAL NOT NULL,
    "photoLink" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductMainPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductMainPhoto_productId_key" ON "ProductMainPhoto"("productId");

-- AddForeignKey
ALTER TABLE "ProductMainPhoto" ADD CONSTRAINT "ProductMainPhoto_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
