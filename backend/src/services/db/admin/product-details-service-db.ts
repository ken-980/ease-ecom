import { ImageUrls, productDetails, ImagePublicIds } from "../../../types/product-types";
import { prismaClientInstance } from '../../../db/prismaClient';

//save product details to database
export const productDetailsServeSaveDb = async (imagesUrl: ImageUrls[], product: productDetails) => {

    const prisma = prismaClientInstance;



    try {
        const productFilePathsJson = JSON.stringify(imagesUrl)


        //ProductInfo table relates 1:1 Admin
        //ProductInfo table relates 1:1 ProductPublicId

        const d = await prisma.productInfo.create({
            data: {
                productName: product.product_name.toString(),
                productPrice: product.product_price.toString(),
                productType: product.product_type.toString(),
                productGenderUse: product.product_gender_use.toString(),
                productQuantity: Number(product.product_quantity),
                productFilePath: productFilePathsJson,
                productValue: Number(product.product_price) * Number(product.product_quantity),
                admin: {
                    connect: {
                        userName: product.admin_id.toString()
                    }
                },

            }
        })
        //return response
        if (d) {
            return true
        }
    } catch (error) {
        console.log(error, typeof error);

        await prisma.$disconnect()
    }

}