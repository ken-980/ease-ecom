import { prismaClientInstance } from '../../../db/prismaClient';

export const deleteRecord = async (id: string): Promise<boolean | null> => {

    try {

        const prisma = prismaClientInstance;
        const productId = Number(id);
        const del = await prisma.productInfo.delete({
            where: {
                id: productId
            }
        })

        if (del) {
            return true
        }
        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
}