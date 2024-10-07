import { v2 } from "cloudinary";


const cloudName = process.env.CLOUD_NAME as string;
const apiKey = process.env.API_KEY as string;
const apiSecret = process.env.API_SECRET as string;

export const cloudinary = v2.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
})
