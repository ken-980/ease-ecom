import { ImageUrls, productDetails } from "../../../types/types";
import { prismaClientInstance } from '../../../db/prismaClient';

//save product details to database
export const productDetailsServeSaveDb = async (imagesUrl: ImageUrls[], product: productDetails) => {

    const prisma = prismaClientInstance;

    try {
        const productFilePathsJson = JSON.stringify(imagesUrl)

        await prisma.productInfo.create({
            data: {
                productName: product.product_name.toString(),
                productPrice: product.product_price.toString(),
                productType: product.product_type.toString(),
                productGenderUse: product.product_gender_use.toString(),
                productQuantity: Number(product.product_quantity),
                productFilePath: productFilePathsJson,
                admin: {
                    connect: {
                        userName: product.admin_id.toString()
                    }
                }
            }
        })
        //return response
        return null;
    } catch (error) {
        console.log(error, typeof error);

        await prisma.$disconnect()
    }

}