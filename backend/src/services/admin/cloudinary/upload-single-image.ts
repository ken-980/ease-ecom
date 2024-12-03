import { v2 as cloudinary } from "cloudinary"


const cloudName = process.env.CLOUD_NAME as string;
const apiKey = process.env.API_KEY as string;
const apiSecret = process.env.API_SECRET as string;

//config here for type reasons
cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
})


/** 
 * @param file files buffer
 * @returns Promise
 */

export const singleImageUpLoaderService = async (file: Buffer): Promise<string | undefined> => {

    //upload a single image
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: `main-photos` }, (error, result) => {
            if (error) {
                reject(error)
            }
            resolve(result?.secure_url);
        }).end(file)
    })
}

