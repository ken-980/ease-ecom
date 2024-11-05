import { prismaClientInstance } from "../../../db/prismaClient";
import { logger } from "../../../../logger";

export const productValue = async (): Promise<number | null> => {

    try {


        const value = await prismaClientInstance.productInfo.aggregate({
            _sum: {
                productValue: true
            }
        })

        return value._sum.productValue;

    } catch (error) {
        logger.log({ level: "error", message: `Error in upload service: ${error}` })
        return null;
    }

}