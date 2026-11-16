import multer from "multer";
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';


// multer files to storefiles in memory temporarily
export const uploadeMedia = multer({
    limits : { fileSize: 50 * 1024 * 1024 },
    fileFilter:  (req, file, cb) => {
        if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")){
            cb(null, true);
        }else{
            cb(new Error("Only images and videos are allowed!"));
        }
    }
})

// helper, uploads a single buffer to cloudinary
export const streamUpload = (fileBuffer: Buffer, folderName: string): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: 'auto',
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};