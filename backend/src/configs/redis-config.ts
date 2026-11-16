import { createClient } from "redis";
import { logger } from "../../logger"; 

export const redisClient = createClient({
    url: process.env.REDIS_URL ?? "redis://localhost:6379",
});

redisClient.on("error", (error) => {
    logger.log({ level: "error", message: `Redis error: ${error}` });
});

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};