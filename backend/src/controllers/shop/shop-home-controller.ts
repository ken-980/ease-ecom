import { Request, Response } from "express"
import { redisClientConfig } from "../../configs/redis-config";


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

        await redisClientConfig.set('mykey', 'Hello from node redis');
        const myKeyValue = await redisClientConfig.get('mykey');
        await redisClientConfig.expireAt("mykey", 8000);
        console.log(myKeyValue);



        //close redis client !!!
        await redisClientConfig.quit()

        return res.status(200).send({ success: true, message: "data", data: myKeyValue });

    } catch (error) {
        console.log(`shop home controller error => : ${error}`);
        res.status(500).send({ success: true, message: "server error" });
    }
}

