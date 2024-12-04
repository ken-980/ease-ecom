import { prismaClientInstance } from '../../../db/prismaClient';
import { productDetails } from '../../../types/product-types';


export const productDetailsRangeQuery = async (from: number = 0, to: number): Promise<object | null> => {

    try {

        const prisma = prismaClientInstance;

        const results = await prisma.productInfo.findMany({
            skip: from,
            take: to,
            select: {
                id: true,
                productDescription: true,
                productName: true,
                productPrice: true,
                mainPhoto: true
            },

        })
        return results;
    } catch (error) {
        console.log(error)
        return null;
    }
}