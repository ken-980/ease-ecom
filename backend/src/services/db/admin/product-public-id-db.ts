import { ImagePublicIds } from "../../../types/types"
import { prismaClientInstance } from '../../../db/prismaClient';
import { logger } from "../../../../logger";
import { json } from "body-parser";
import { ProductPublicId } from "@prisma/client";



export const productPublicId = async (ImagePublicId: ImagePublicIds[]): Promise<number | null> => {

    try {

        const prisma = prismaClientInstance;

        const publicIdJson = JSON.stringify(ImagePublicId);


        const public_id = await prisma.productPublicId.create({
            data: {
                publicId: publicIdJson
            }
        })

        return public_id.id;
    } catch (error) {
        logger.log({ level: "error", message: `Error in upload service: ${error}` })
        return null;
    }


}