// src/controllers/admin/edit-product-controller.ts
import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import DOMPurify from "isomorphic-dompurify";
import { prismaClientInstance } from "../../db/prismaClient";
import { redisClient } from "../../configs/redis-config";
import { INVENTORY_OVERVIEW_CACHE_KEY } from "./inventory-overview-controller";
import type { ProcessedMediaItem } from "../../middleware/admin/product-upload-middleware";
import { logger } from "../../../logger";

const getProductCacheKey = (productId: number) => `admin:product:${productId}`;

const cleanupUploadedMedia = async (media: ProcessedMediaItem[]) => {
  if (media.length === 0) return;

  await Promise.allSettled(
    media.map((item) =>
      cloudinary.uploader.destroy(item.publicId, {
        resource_type: item.type === "VIDEO" ? "video" : "image",
      }),
    ),
  );
};

/**
 * GET /admin/products/:productId
 * Fetches full product details + all media (thumbnail, gallery, videos) for View/Edit pages
 */
export const getProductDetailController = async (
  req: Request,
  res: Response,
) => {
  try {
    const productId = Number.parseInt(req.params.productId, 10);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID provided.",
      });
    }

    const cacheKey = getProductCacheKey(productId);

    // 1. Check Redis cache first (fail-open)
    try {
      if (redisClient?.isOpen) {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          return res.status(200).json(JSON.parse(cached));
        }
      }
    } catch (redisErr) {
      logger.log({
        level: "warn",
        message: `Redis read skipped for ${cacheKey}: ${redisErr}`,
      });
    }

    // 2. Query PostgreSQL for full product + ordered media (main thumbnail first)
    const product = await prismaClientInstance.productInfo.findUnique({
      where: { id: productId },
      include: {
        media: {
          orderBy: [{ isMain: "desc" }, { id: "asc" }],
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const mainImage = product.media.find((m) => m.isMain);

    const responsePayload = {
      success: true,
      product: {
        id: product.id,
        productBrand: product.productBrand,
        productName: product.productName,
        productType: product.productType,
        productGenderUse: product.productGenderUse,
        productQuantity: product.productQuantity,
        productPrice: Number(product.productPrice),
        productDescription: product.productDescription,
        productValue: product.productValue,
        adminUsername: product.adminUsername,
        thumbnailUrl: mainImage?.url ?? null,
        createdAt: product.createdAt.toISOString(),
        media: product.media,
      },
    };

    // 3. Store in Redis (5-minute TTL)
    try {
      if (redisClient?.isOpen) {
        await redisClient.setEx(cacheKey, 300, JSON.stringify(responsePayload));
      }
    } catch (redisErr) {
      logger.log({
        level: "warn",
        message: `Redis write skipped for ${cacheKey}: ${redisErr}`,
      });
    }

    return res.status(200).json(responsePayload);
  } catch (error) {
    logger.log({
      level: "error",
      message: `Get product detail error: ${error}`,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to load product details.",
    });
  }
};

export const updateProductController = async (req: Request, res: Response) => {
  const newlyUploadedMedia: ProcessedMediaItem[] = Array.isArray(
    req.body.processedMedia,
  )
    ? req.body.processedMedia
    : [];

  try {
    const adminUsername = req.user?.userName;
    if (!adminUsername) {
      await cleanupUploadedMedia(newlyUploadedMedia);
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Admin session not found.",
      });
    }

    const productId = Number.parseInt(req.params.productId, 10);
    if (!Number.isInteger(productId) || productId <= 0) {
      await cleanupUploadedMedia(newlyUploadedMedia);
      return res.status(400).json({
        success: false,
        message: "Invalid product ID provided.",
      });
    }

    const existingProduct = await prismaClientInstance.productInfo.findUnique({
      where: { id: productId },
      include: { media: true },
    });

    if (!existingProduct) {
      await cleanupUploadedMedia(newlyUploadedMedia);
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const {
      productBrand,
      productName,
      productType,
      productGenderUse,
      productPrice,
      productDescription,
      productQuantity,
      productValue,
      removedMediaIds, // Optional JSON stringified number[] e.g. "[12, 15]"
    } = req.body;

    // Validate required fields
    if (
      typeof productBrand !== "string" ||
      !productBrand.trim() ||
      typeof productName !== "string" ||
      !productName.trim() ||
      typeof productType !== "string" ||
      !productType.trim() ||
      typeof productGenderUse !== "string" ||
      !productGenderUse.trim() ||
      productPrice === undefined ||
      String(productPrice).trim() === "" ||
      productQuantity === undefined ||
      String(productQuantity).trim() === ""
    ) {
      await cleanupUploadedMedia(newlyUploadedMedia);
      return res.status(400).json({
        success: false,
        message: "All required product fields must be provided.",
      });
    }

    const parsedPrice = Number(productPrice);
    const parsedQuantity = Number(productQuantity);

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      await cleanupUploadedMedia(newlyUploadedMedia);
      return res.status(400).json({
        success: false,
        message: "Product price must be greater than 0.",
      });
    }

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 0) {
      await cleanupUploadedMedia(newlyUploadedMedia);
      return res.status(400).json({
        success: false,
        message: "Product quantity must be a whole number (0 or more).",
      });
    }

    const parsedValue =
      productValue !== undefined && String(productValue).trim() !== ""
        ? Number(productValue)
        : null;

    if (
      parsedValue !== null &&
      (!Number.isInteger(parsedValue) || parsedValue < 0)
    ) {
      await cleanupUploadedMedia(newlyUploadedMedia);
      return res.status(400).json({
        success: false,
        message: "Product value must be a valid whole number.",
      });
    }

    // Parse media IDs marked for removal by the admin
    let idsToRemove: number[] = [];
    if (typeof removedMediaIds === "string" && removedMediaIds.trim()) {
      try {
        const parsed = JSON.parse(removedMediaIds);
        if (Array.isArray(parsed)) {
          idsToRemove = parsed
            .map((id) => Number(id))
            .filter((id) => Number.isInteger(id) && id > 0);
        }
      } catch {
        await cleanupUploadedMedia(newlyUploadedMedia);
        return res.status(400).json({
          success: false,
          message: "Invalid removedMediaIds format.",
        });
      }
    }

    // Check if a new main thumbnail was uploaded; if so, automatically retire the old main thumbnail
    const hasNewThumbnail = newlyUploadedMedia.some((media) => media.isMain);
    const remainingMain = existingProduct.media.some(
      (m) => m.isMain && !idsToRemove.includes(m.id),
    );

    if (!hasNewThumbnail && !remainingMain) {
      await cleanupUploadedMedia(newlyUploadedMedia);
      return res.status(400).json({
        success: false,
        message: "Main product thumbnail is required.",
      });
    }

    const mediaRecordsToDelete = existingProduct.media.filter((m) =>
      idsToRemove.includes(m.id),
    );

    // Evaluate remaining media after factoring in requested deletions
    const remainingExistingMedia = existingProduct.media.filter(
      (m) => !idsToRemove.includes(m.id),
    );

    const hasValidThumbnailOrMedia =
      hasNewThumbnail ||
      remainingExistingMedia.length > 0 ||
      newlyUploadedMedia.length > 0;

    const hasValidThumbnail = hasNewThumbnail || remainingMain;

    if (!hasValidThumbnail) {
      await cleanupUploadedMedia(newlyUploadedMedia);
      return res.status(400).json({
        success: false,
        message: "Main product thumbnail is required.",
      });
    }

    // Sanitize Tiptap HTML
    let cleanDescription: string | null = null;
    if (typeof productDescription === "string" && productDescription.trim()) {
      const sanitized = DOMPurify.sanitize(productDescription.trim());
      const plainText = sanitized.replace(/<[^>]*>/g, "").trim();
      cleanDescription = plainText.length > 0 ? sanitized : null;
    }

    // Update product + delete removed media + attach new media atomically
    const updatedProduct = await prismaClientInstance.productInfo.update({
      where: { id: productId },
      data: {
        productBrand: productBrand.trim(),
        productName: productName.trim(),
        productType: productType.trim(),
        productGenderUse: productGenderUse.trim(),
        productPrice: parsedPrice.toFixed(2),
        productDescription: cleanDescription,
        productQuantity: parsedQuantity,
        productValue: parsedValue,
        media: {
          ...(idsToRemove.length > 0 && {
            deleteMany: { id: { in: idsToRemove } },
          }),
          ...(newlyUploadedMedia.length > 0 && {
            create: newlyUploadedMedia,
          }),
        },
      },
      include: {
        media: {
          orderBy: [{ isMain: "desc" }, { id: "asc" }],
        },
      },
    });

    // Delete retired media from Cloudinary AFTER database commit succeeds
    if (mediaRecordsToDelete.length > 0) {
      await Promise.allSettled(
        mediaRecordsToDelete.map((item) =>
          cloudinary.uploader.destroy(item.publicId, {
            resource_type: item.type === "VIDEO" ? "video" : "image",
          }),
        ),
      );
    }

    // Invalidate both product detail cache and inventory overview cache
    if (redisClient?.isOpen) {
      await Promise.allSettled([
        redisClient.del(getProductCacheKey(productId)),
        redisClient.del(INVENTORY_OVERVIEW_CACHE_KEY),
      ]);
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (error) {
    // Rollback newly uploaded Cloudinary files if database update failed
    await cleanupUploadedMedia(newlyUploadedMedia);

    logger.log({
      level: "error",
      message: `Update product controller error: ${error}`,
    });

    return res.status(500).json({
      success: false,
      message:
        (error as Error).message || "Failed to update product in database.",
    });
  }
};
