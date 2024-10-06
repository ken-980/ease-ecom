import { v2 as cloudinary, UploadApiResponse } from "cloudinary"
import { ImageUrls } from "../../../types/types";
const cloudName = process.env.CLOUD_NAME as string;
const apiKey = process.env.API_KEY as string;
const apiSecret = process.env.API_SECRET as string;

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
})



/**
 * 
 * @param files files buffer
 * @param productName product name
 * @returns Promise
 */



export const productUpLoaderService = async (files: Buffer[], productName: string): Promise<ImageUrls[] | void | null> => {

    const urls = files.map((file) => {
        //file can be undefined
        if (file) {
            return new Promise((resolve, reject) => {

                cloudinary.uploader.upload_stream({ folder: `product-images/${productName.toLowerCase()}` }, (error, result) => {
                    if (error) {
                        reject(new Error(error.message));
                    }
                    resolve(result?.secure_url);

                }).end(file);
            })
        }
    });



    //image links array 
    const fileUrls: ImageUrls[] = [];

    const urlArray = Promise.all(urls).then((result) => {
        if (typeof result === 'object') {
            result.map((url) => {
                if (typeof url === "string") {
                    fileUrls.push({ imageUrl: url });
                }
            });
        }
        return fileUrls;


    }).catch((err) => {

        console.log(err)

        return null;
    });

    return await urlArray;
}

