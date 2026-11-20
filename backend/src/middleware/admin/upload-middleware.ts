import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { streamUpload } from '../../helpers/multer-upload-helper';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface ProcessedMediaItem {
  url: string;
  publicId: string;
  type: 'IMAGE' | 'VIDEO';
  isMain: boolean;
}

// Multer with strict file limits and MIME filtering
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max (accommodates product videos)
    files: 9, // 1 thumbnail + 6 galleryImages + 2 videos
  },
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  },
});

export const parseProductMediaFields = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'galleryImages', maxCount: 6 },
  { name: 'videos', maxCount: 2 },
]);

// Upload all 3 field groups concurrently to Cloudinary
export const handleCloudinaryUploads = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    // Build upload tasks with explicit isMain and MediaType flags
    const uploadTasks: Promise<ProcessedMediaItem>[] = [
      streamUpload(thumbnailFile.buffer, 'ecommerce_products').then((res) => ({
        url: res.secure_url,
        publicId: res.public_id,
        type: 'IMAGE',
        isMain: true,
      })),

      ...galleryFiles.map((file) =>
        streamUpload(file.buffer, 'ecommerce_products').then((res) => ({
          url: res.secure_url,
          publicId: res.public_id,
          type: 'IMAGE' as const,
          isMain: false,
        }))
      ),

      ...videoFiles.map((file) =>
        streamUpload(file.buffer, 'ecommerce_products').then((res) => ({
          url: res.secure_url,
          publicId: res.public_id,
          type: 'VIDEO' as const,
          isMain: false,
        }))
      ),
    ];

    req.body.processedMedia = await Promise.all(uploadTasks);
    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message || 'Media upload to Cloudinary failed.',
    });
  }
};