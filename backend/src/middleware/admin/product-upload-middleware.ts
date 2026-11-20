// src/middleware/admin/product-upload-middleware.ts
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { uploadeMedia, streamUpload } from '../../helpers/multer-upload-helper';

export interface ProcessedMediaItem {
  url: string;
  publicId: string;
  type: 'IMAGE' | 'VIDEO';
  isMain: boolean;
}

const rawFieldsParser = uploadeMedia.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'galleryImages', maxCount: 6 },
  { name: 'videos', maxCount: 2 },
]);

// Parse multipart fields & catch Multer size/count errors cleanly
export const parseProductMediaFields = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  rawFieldsParser(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'One or more files exceed the 50MB size limit.',
        });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          success: false,
          message: `Too many files or unexpected field: ${err.field}.`,
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (err instanceof Error) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    return next();
  });
};

// Upload parsed buffers concurrently to Cloudinary (with rollback if any single upload fails)
export const handleCloudinaryUploads = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uploadedPublicIds: Array<{ publicId: string; type: 'IMAGE' | 'VIDEO' }> = [];

  try {
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    const thumbnailFile = files?.thumbnail?.[0];
    const galleryFiles = files?.galleryImages ?? [];
    const videoFiles = files?.videos ?? [];

    if (!thumbnailFile) {
      return res.status(400).json({
        success: false,
        message: 'Main product thumbnail is required.',
      });
    }

    // Track every completed upload immediately so partial failures can be cleaned up
    const uploadSingle = async (
      file: Express.Multer.File,
      type: 'IMAGE' | 'VIDEO',
      isMain: boolean
    ): Promise<ProcessedMediaItem> => {
      const result = await streamUpload(file.buffer, 'ecommerce_products');
      uploadedPublicIds.push({ publicId: result.public_id, type });
      return {
        url: result.secure_url,
        publicId: result.public_id,
        type,
        isMain,
      };
    };

    const tasks: Promise<ProcessedMediaItem>[] = [
      uploadSingle(thumbnailFile, 'IMAGE', true),
      ...galleryFiles.map((file) => uploadSingle(file, 'IMAGE', false)),
      ...videoFiles.map((file) => uploadSingle(file, 'VIDEO', false)),
    ];

    req.body.processedMedia = await Promise.all(tasks);
    return next();
  } catch (error) {
    // Clean up any files that succeeded before another file failed
    if (uploadedPublicIds.length > 0) {
      await Promise.allSettled(
        uploadedPublicIds.map((item) =>
          cloudinary.uploader.destroy(item.publicId, {
            resource_type: item.type === 'VIDEO' ? 'video' : 'image',
          })
        )
      );
    }

    return res.status(500).json({
      success: false,
      message: (error as Error).message || 'Failed to upload media to Cloudinary.',
    });
  }
};