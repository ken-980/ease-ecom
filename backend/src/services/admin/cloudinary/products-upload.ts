import { v2 as cloudinary } from "cloudinary"
import { ImageUrls } from "../../../types/types";
import { url } from "inspector";
import { logger } from "../../../../logger";




const cloudName = process.env.CLOUD_NAME as string;
const apiKey = process.env.API_KEY as string;
const apiSecret = process.env.API_SECRET as string;

//config here for type reason
cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
})

interface LinkData {
    url: string
    public_id: string
}

/** 
 * @param files files buffer
 * @param productName product name
 * @returns Promise
 */


export const productUpLoaderService = async (files: Buffer[], productName: string): Promise<ImageUrls[] | void | null> => {

    const urls = files.map((file) => {
        //file can be undefined
        if (file) {
            return new Promise((resolve, reject) => {

                //file path
                cloudinary.uploader.upload_stream({ folder: `product-images/${productName.toLowerCase()}` }, (error, result) => {
                    if (error) {
                        reject(new Error(error.message));
                    }

                    resolve({ url: result?.secure_url, public_id: result?.public_id });

                }).end(file);
            })
        }
    });




    const urlArray = Promise.all(urls).then((result) => {

        //image links array 
        const fileUrls: ImageUrls[] = [];

        //image public_id and url
        if (typeof result === "object") {
            result.map((data) => {
                if (typeof data === "object") {
                    const r = data as ImageUrls;
                    fileUrls.push({ public_id: r.public_id, url: r.url })
                }
            })
        }
        return fileUrls;
    }).catch((err) => {
        logger.log({ level: "error", message: `in upload service: ${err}` })
        return null;
    });

    return await urlArray;
    //return null;
}

