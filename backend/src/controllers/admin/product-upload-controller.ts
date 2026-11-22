// src/controllers/admin/product-upload-controller.ts
import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import DOMPurify from 'isomorphic-dompurify';
import { prismaClientInstance } from './../../db/prismaClient';
import type { ProcessedMediaItem } from '../../middleware/admin/product-upload-middleware';
import { redisClient } from '../../configs/redis-config';
import { INVENTORY_OVERVIEW_CACHE_KEY } from './inventory-overview-controller';

const cleanupUploadedMedia = async (media: ProcessedMediaItem[]) => {
  if (media.length === 0) return;

  await Promise.allSettled(
    media.map((item) =>
      cloudinary.uploader.destroy(item.publicId, {
        resource_type: item.type === 'VIDEO' ? 'video' : 'image',
      })
    )
  );
};

export const productUploaderController = async (req: Request, res: Response) => {
  const processedMedia: ProcessedMediaItem[] = Array.isArray(req.body.processedMedia)
    ? req.body.processedMedia
    : [];

  try {
    // Pull verified admin username from verifyAdminAuth middleware
    const adminUsername = req.user?.userName;

    if (!adminUsername) {
      await cleanupUploadedMedia(processedMedia);
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Admin session not found.',
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
    } = req.body;

    // Validate required text & numeric fields (and clean up Cloudinary if invalid)
    if (
      typeof productBrand !== 'string' || !productBrand.trim() ||
      typeof productName !== 'string' || !productName.trim() ||
      typeof productType !== 'string' || !productType.trim() ||
      typeof productGenderUse !== 'string' || !productGenderUse.trim() ||
      productPrice === undefined || String(productPrice).trim() === '' ||
      productQuantity === undefined || String(productQuantity).trim() === ''
    ) {
      await cleanupUploadedMedia(processedMedia);
      return res.status(400).json({
        success: false,
        message: 'All required product fields must be provided.',
      });
    }

    const parsedPrice = Number(productPrice);
    const parsedQuantity = Number(productQuantity);

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      await cleanupUploadedMedia(processedMedia);
      return res.status(400).json({
        success: false,
        message: 'Product price must be greater than 0.',
      });
    }

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 0) {
      await cleanupUploadedMedia(processedMedia);
      return res.status(400).json({
        success: false,
        message: 'Product quantity must be a whole number (0 or more).',
      });
    }

    const parsedValue =
      productValue !== undefined && String(productValue).trim() !== ''
        ? Number(productValue)
        : null;

    if (parsedValue !== null && (!Number.isInteger(parsedValue) || parsedValue < 0)) {
      await cleanupUploadedMedia(processedMedia);
      return res.status(400).json({
        success: false,
        message: 'Product value must be a valid whole number.',
      });
    }

    // Sanitize rich-text HTML and store null if editor only submitted empty tags (<p></p>)
    let cleanDescription: string | null = null;
    if (typeof productDescription === 'string' && productDescription.trim()) {
      const sanitized = DOMPurify.sanitize(productDescription.trim());
      const plainText = sanitized.replace(/<[^>]*>/g, '').trim();
      cleanDescription = plainText.length > 0 ? sanitized : null;
    }

    // Create ProductInfo + nested ProductMedia atomically in PostgreSQL
    const newProduct = await prismaClientInstance.productInfo.create({
      data: {
        productBrand: productBrand.trim(),
        productName: productName.trim(),
        productType: productType.trim(),
        productGenderUse: productGenderUse.trim(),
        productPrice: parsedPrice.toFixed(2),
        productDescription: cleanDescription,
        productQuantity: parsedQuantity,
        productValue: parsedValue,
        adminUsername,
        media: {
          create: processedMedia,
        },
      },
      include: {
        media: true,
      },
    });

    // invalidate cache before sending response
    if (redisClient?.isOpen) {
      await redisClient.del(INVENTORY_OVERVIEW_CACHE_KEY).catch(() => {});
    }

    return res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      product: newProduct,
    });
  } catch (error) {
    // Rollback Cloudinary uploads on any unexpected database or runtime failure
    await cleanupUploadedMedia(processedMedia);

    return res.status(500).json({
      success: false,
      message:
        (error as Error).message || 'Failed to save product to database.',
    });
  }
};