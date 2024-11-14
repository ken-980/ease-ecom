import { Request, Response } from "express"
import { redisClientConfig } from "../../configs/redis-config";
import { productDetailsRangeQuery } from "../../services/db/shop/get-product-details-load-service-db";
import { logger } from "../../../logger";
import { firstImageUtility } from "../../utilities/first-image-link-utility";

type HomepageLoaderType = {
    id: number
    productName: string
    productDescription: string
    productFilePath: string
    productPrice: number
}


/**
 *load shop home data
 * caches data
 *
 * @param req Request
 * @param res Response
 * @returns Promise
 */
export const shopHomeController = async (req: Request, res: Response) => {

    try {

        //connect redis
        await redisClientConfig.connect();


        const cachedDbData = await redisClientConfig.get("dbDataShopHome");

        if (cachedDbData) {

            await redisClientConfig.quit()

            return res.status(200).send({ success: true, message: "data", data: cachedDbData });

        } else {

            //db range data query
            const productDetails = await productDetailsRangeQuery(1, 3);


            console.log(productDetails)
            //cache data
            await redisClientConfig.set("dbDataShopHome", JSON.stringify(productDetails))

            //set expire time cached data expiration
            await redisClientConfig.expireAt("dbDataShopHome", 9000);

            //quit redis
            await redisClientConfig.quit()

            return res.status(200).send({ success: true, message: "data", data: productDetails });
        }

    } catch (error) {

        logger.log({ level: "error", message: `Shop home controller error => : ${error}` })

        res.status(500).send({ success: true, message: "server error" });
    }
}

