import { Request, Response } from "express"
import { redisClientConfig } from "../../configs/redis-config";
import { productDetailsRangeQuery } from "../../services/db/shop/get-product-details-load-service-db";


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
            const productDetails = await productDetailsRangeQuery(1, 3);

            const cache = await redisClientConfig.set("dbDataShopHome", JSON.stringify(productDetails))
            console.log(cache)
            await redisClientConfig.quit()
            return res.status(200).send({ success: true, message: "data", data: productDetails });
        }

        // await redisClientConfig.set('mykey', 'Hello from node redis');
        // const myKeyValue = await redisClientConfig.get('mykey');
        // await redisClientConfig.expireAt("mykey", 8000);
        // console.log(myKeyValue);



        //close redis client !!!
        // await redisClientConfig.quit()

        // return res.status(200).send({ success: true, message: "data", data: myKeyValue });

    } catch (error) {
        console.log(`shop home controller error => : ${error}`);
        res.status(500).send({ success: true, message: "server error" });
    }
}

