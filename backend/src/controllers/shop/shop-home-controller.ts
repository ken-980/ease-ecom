import { Request, Response } from "express"
import { redisClientConfig } from "../../configs/redis-config";
import { productDetailsRangeQuery } from "../../services/db/shop/get-product-details-load-service-db";
import { logger } from "../../../logger";

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

        //set query limit or defaults to 10
        const { limit } = req.query || "0";

        //connect redis
        await redisClientConfig.connect();


        const cachedDbData = await redisClientConfig.get("dbDataShopHome");

        if (cachedDbData) {

            //quit redis before sending cached data
            await redisClientConfig.quit()

            return res.status(200).send({ success: true, message: "data", responseData: cachedDbData });

        } else {

            //db range data query
            const productDetails = await productDetailsRangeQuery(0, Number(limit));

            //cache data
            await redisClientConfig.set("dbDataShopHome", JSON.stringify(productDetails))

            //set expire time for cached data expiration
            await redisClientConfig.expireAt("dbDataShopHome", 9000);

            //quit redis
            await redisClientConfig.quit()

            return res.status(200).send({ success: true, message: "", responseData: productDetails });
        }

    } catch (error) {

        logger.log({ level: "error", message: `Shop home controller error => : ${error}` })

        res.status(500).send({ success: false, message: "server error" });
    }
}

