import { prismaClientInstance } from "../../../db/prismaClient"

export const productInfo = async (productId: number) => {

    try {

        const prisma = prismaClientInstance

        const productDetails = await prisma.productInfo.findUnique({
            where: {
                id: productId
            }
        })

        return productDetails;
    } catch (error) {
        console.log(error)
    }

}