import { redisClient } from "../../configs/redis-config";
import { logger } from "../../../logger";
import { prismaClientInstance } from "../../db/prismaClient";


const CACHE_KEY = "admin:dashboard:view";
const TTL_SECONDS = 60;

type DashboardViewData = {
    inventoryVolume: number;
    inventoryValue: number;
};

const readCache = async (): Promise<DashboardViewData | null> => {
    try {
        if (!redisClient.isReady) return null;
        const cached = await redisClient.get(CACHE_KEY);
        return cached ? (JSON.parse(cached) as DashboardViewData) : null;
    } catch (error) {
        logger.log({ level: "warn", message: `Dashboard cache read failed: ${error}` });
        return null;
    }
};

const writeCache = async (data: DashboardViewData) => {
    try {
        if (!redisClient.isReady) return;
        await redisClient.set(CACHE_KEY, JSON.stringify(data), { EX: TTL_SECONDS });
    } catch (error) {
        logger.log({ level: "warn", message: `Dashboard cache write failed: ${error}` });
    }
};

export const invalidateDashboardCache = async () => {
    try {
        if (!redisClient.isReady) return;
        await redisClient.del(CACHE_KEY);
    } catch (error) {
        logger.log({ level: "warn", message: `Dashboard cache delete failed: ${error}` });
    }
};

export const getDashboardViewData = async (): Promise<DashboardViewData> => {
    // 1. cache first
    const cached = await readCache();
    if (cached) return cached;

    // 2. database: both queries run in parallel
    const [stock, products] = await Promise.all([
        prismaClientInstance.productInfo.aggregate({ _sum: { productQuantity: true } }),
        prismaClientInstance.productInfo.findMany({
            select: { productPrice: true, productQuantity: true },
        }),
    ]);

    const inventoryVolume = stock._sum.productQuantity ?? 0;

    const inventoryValue = products.reduce(
        (total, p) => total + Number(p.productPrice) * p.productQuantity,
        0
    );

    const data: DashboardViewData = { inventoryVolume, inventoryValue };

    // 3. cache for next time
    await writeCache(data);

    return data;
};