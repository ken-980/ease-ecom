import { prismaClientInstance } from "../../../db/prismaClient";


export const checkProductExists = async (productId: number): Promise<boolean> => {

    try {

        const product = await prismaClientInstance.productInfo.findUnique({
            where: {
                id: productId
            }
        })

        return (product === null) ? false : true;

    } catch (error) {
        console.log(`Database error => ${error}`);
        return false;
    }

}