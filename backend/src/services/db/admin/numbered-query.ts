import { prismaClientInstance } from '../../../db/prismaClient';

export const limitQuery = async (from: number = 0, to: number): Promise<object | null> => {

    try {

        const prisma = prismaClientInstance;


        const results = await prisma.productInfo.findMany({
            skip: from,
            take: to
        })
        return results;
    } catch (error) {
        console.log(error)
        return null;
    }
}