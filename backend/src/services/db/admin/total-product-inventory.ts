import { prismaClientInstance } from '../../../db/prismaClient';

/**
 * 
 * @returns Promsie<null | number>
 */



//get total products inventory from db
export const totalInventory = async (): Promise<number | null> => {

    try {

        const prisma = prismaClientInstance;
        const sum = await prisma.productInfo.aggregate({
            _sum: {
                productQuantity: true
            }
        })

        if (!sum._sum.productQuantity) {
            return null
        }

        return sum._sum.productQuantity;
    } catch (error) {
        console.log(error)
        return null;
    }
}