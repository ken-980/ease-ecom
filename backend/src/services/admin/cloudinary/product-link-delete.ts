
import { v2 as cloudinary } from "cloudinary";


const cloudName = process.env.CLOUD_NAME as string;
const apiKey = process.env.API_KEY as string;
const apiSecret = process.env.API_SECRET as string;

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
})

export const deletImageLinksFromCloud = async (links: string[]) => {

    const res = await cloudinary.api.delete_resources(links).then((res) => {
        return res;
    }).catch((err) => {
        console.log(`Error in deleting links: ${err}`)
    })

    if (res) {
        return true;
    }

    return false;
}


// cloudinary.v2.api
//   .delete_resources(['product-images/test2/ppuxi0ihyvaveo0j5s5s', 'product-images/test2/d4t2lzeqooysduno9qqf'], 
//     { type: 'upload', resource_type: 'image' })
//   .then(console.log);