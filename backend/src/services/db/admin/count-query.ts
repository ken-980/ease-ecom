import { prismaClientInstance } from '../../../db/prismaClient';

export const countTotalProduct = async (): Promise<number | null> => {

    try {

        const prisma = prismaClientInstance;

        const records = prisma.productInfo.count();

        return records;
    } catch (error) {
        console.log(error)
        return null;
    }
}