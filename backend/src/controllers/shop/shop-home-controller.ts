import { Request, Response } from "express"
import { connectRedis, redisClient } from "../../configs/redis-config";
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
        const { limit } = req.query || 10;
        const CACHE_KEY = "admin:dashboard:view";
        const TTL_SECONDS = 60;


        const readCache = async (): Promise<HomepageLoaderType[] | null> => {
            try {
                if (!redisClient.isReady) return null;
                const cached = await redisClient.get(CACHE_KEY);
                return cached ? (JSON.parse(cached) as HomepageLoaderType[]) : null;
            } catch (error) {
                logger.log({ level: "warn", message: `Dashboard cache read failed: ${error}` });
                return null;
            }
        };

        if (readCache) {

            return res.status(200).send({ success: true, responseData: readCache });

        } else {

            //db range data query
            const productDetails = await productDetailsRangeQuery(0, Number(limit));

            //cache data
            await redisClient.set("cachedData", JSON.stringify(productDetails))

            //quit redis
            await redisClient.quit()

            return res.status(200).send({ success: true, responseData: productDetails });
        }

    } catch (error) {

        logger.log({ level: "error", message: `Shop home controller, ${error}` })

        res.status(500).send({ success: false, message: "server error" });
    }
}

