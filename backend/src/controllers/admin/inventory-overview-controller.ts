
// src/controllers/admin/inventory-overview-controller.ts
import { Request, Response } from 'express';
import { prismaClientInstance } from '../../db/prismaClient';
import { redisClient } from '../../configs/redis-config';
import { logger } from '../../../logger';

export const INVENTORY_OVERVIEW_CACHE_KEY = 'admin:inventory:overview';
const CACHE_TTL_SECONDS = 300; // 5 minutes safety TTL

export const getInventoryOverviewController = async (
  _req: Request,
  res: Response
) => {
  try {
    // Try reading from Redis cache first (fail-open if Redis is unavailable)
    try {
      if (redisClient?.isOpen) {
        const cachedPayload = await redisClient.get(INVENTORY_OVERVIEW_CACHE_KEY);
        if (cachedPayload) {
          return res.status(200).json(JSON.parse(cachedPayload));
        }
      }
    } catch (redisReadError) {
      logger.log({
        level: 'warn',
        message: `Redis read skipped for ${INVENTORY_OVERVIEW_CACHE_KEY}: ${redisReadError}`,
      });
    }

    // Cache miss -> Execute all aggregations and recent list concurrently in PostgreSQL
    const [
      totalProducts,
      outOfStockCount,
      distinctBrands,
      valuationRows,
      recentRows,
    ] = await Promise.all([
      prismaClientInstance.productInfo.count(),
      prismaClientInstance.productInfo.count({
        where: { productQuantity: 0 },
      }),
      prismaClientInstance.productInfo.groupBy({
        by: ['productBrand'],
      }),
      // Compute SUM(productPrice * productQuantity) directly in PostgreSQL
      prismaClientInstance.$queryRaw<Array<{ total: string | number | null }>>`
        SELECT COALESCE(SUM(CAST("productPrice" AS NUMERIC) * "productQuantity"), 0) AS total
        FROM "ProductInfo"
      `,
      prismaClientInstance.productInfo.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          productBrand: true,
          productName: true,
          productType: true,
          productQuantity: true,
          productPrice: true,
          createdAt: true,
          media: {
            where: { isMain: true },
            select: { url: true },
            take: 1,
          },
        },
      }),
    ]);

    const rawValuation = valuationRows[0]?.total ?? 0;
    const totalStockValuation = Number(rawValuation) || 0;

    // Map into strict DTO contract expected by the frontend
    const responsePayload = {
      success: true,
      stats: {
        totalProducts,
        outOfStockCount,
        totalStockValuation: Number(totalStockValuation.toFixed(2)),
        activeBrandsCount: distinctBrands.length,
      },
      recentProducts: recentRows.map((item) => ({
        id: item.id,
        productBrand: item.productBrand,
        productName: item.productName,
        productType: item.productType,
        productQuantity: item.productQuantity,
        productPrice: Number(item.productPrice),
        thumbnailUrl: item.media[0]?.url ?? null,
        createdAt: item.createdAt.toISOString(),
      })),
    };

    // Write to Redis cache asynchronously (fail-open)
    try {
      if (redisClient?.isOpen) {
        await redisClient.setEx(
          INVENTORY_OVERVIEW_CACHE_KEY,
          CACHE_TTL_SECONDS,
          JSON.stringify(responsePayload)
        );
      }
    } catch (redisWriteError) {
      logger.log({
        level: 'warn',
        message: `Redis write skipped for ${INVENTORY_OVERVIEW_CACHE_KEY}: ${redisWriteError}`,
      });
    }

    return res.status(200).json(responsePayload);
  } catch (error) {
    logger.log({
      level: 'error',
      message: `Inventory overview controller error: ${error}`,
    });

    return res.status(500).json({
      success: false,
      message: 'Failed to load inventory overview data.',
    });
  }
};