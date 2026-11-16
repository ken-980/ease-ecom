import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import dotenv from 'dotenv';
import { streamUpload } from '../../helpers/multer-upload-helper';


dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();






// 4Express Middleware to process multiple files and attach results to req.body
export const handleCloudinaryUploads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    
    // Proceed if no files were attached
    if (!files || !files['media']) {
      return next(); 
    }

    // Map through each uploaded file and upload concurrently to Cloudinary
    const uploadPromises = files['media'].map(async (file, index) => {
      const uploadResult = await streamUpload(file.buffer, 'ecommerce_products');
      
      return {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        // Determine type based on mimetype
        type: file.mimetype.startsWith('video/') ? 'VIDEO' : 'IMAGE',
        // Check if this file index matches the designated main photo index sent from the frontend
        isMain: req.body.mainPhotoIndex ? parseInt(req.body.mainPhotoIndex) === index : index === 0,
      };
    });

    // Wait for all uploads to complete
    req.body.processedMedia = await Promise.all(uploadPromises);
    next();
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

