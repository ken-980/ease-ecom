import { Response, Request } from "express"
import { ImagesType } from "../../types/types"
import { imagePulbicIdExtractor } from "../../services/admin/public-id-extractor";
import deletImageLinksFromCloud from "../../services/admin/cloudinary/product-link-delete";
import { logger } from "../../../logger";
import { productDetails } from "../../types/types";
import { productUpLoaderService } from "../../services/admin/cloudinary/products-upload";
import { productDetailsUpdate } from "../../services/db/admin/update-product-details-service-db";


export const editProductCrontroller = async (req: Request, res: Response) => {

    try {
        const { productName, productPrice, productType, productGenderUse, productQuantity, adminId, productId, oldImagesToDelete } = req.body;

        if (!productName || !productPrice || !productType || !productGenderUse || !productQuantity || !adminId) {
            return res.status(400).send({ success: false, message: "Missing data in the body" });
        }


        //if there images to be deleted
        if (oldImagesToDelete) {

            const js = JSON.parse(oldImagesToDelete) as ImagesType[];
            let links: string[] = [];

            js.forEach((link) => {
                links.push(link.url);
            })

            const imageIds = imagePulbicIdExtractor(links);

            const del = await deletImageLinksFromCloud(imageIds);
        }

        //upload
        if (Array.isArray(req.files)) {
            const reqFilesLength = req.files.length

            const filesArray = Array.from<Buffer>({ length: reqFilesLength })

            //get file buffer
            req.files.forEach((file) => {
                if (file) {
                    filesArray.push(file.buffer)
                }
            })

            const { productName, productPrice, productType, productGenderUse, productQuantity, adminId } = req.body;


            if (!productName || !productPrice || !productType || !productGenderUse || !productQuantity || !adminId) {
                return res.status(400).send({ success: false, message: "Missing data in the body" });
            }

            let productNameCon = "";
            //concatenate the product name if space separated
            if (productName.includes(" ")) {
                for (const t of productName.split(" ")) {
                    productNameCon += t;
                }
            }

            //file buffer to upload service
            const urlsObjects = await productUpLoaderService(filesArray, productNameCon);

            if (!urlsObjects) {
                return res.status(500).send({ success: false, message: "Error uploading images" });
            }

            //product details object from request body
            const reqBodyProductDetails: productDetails = { product_name: productName, product_type: productType, product_gender_use: productGenderUse, product_price: productPrice, product_quantity: productQuantity, admin_id: adminId, productId: productId }

            //save product details to database
            const dataSaved = await productDetailsUpdate(urlsObjects, reqBodyProductDetails)

            //successful data saved 
            if (dataSaved) {
                return res.status(200).send({ message: "Data saved", success: true });
            }

        }

        return res.status(401).send({ message: "Sever error", success: false });


    } catch (error) {
        logger.log({ level: "error", message: `Error in upload service: ${error}` })

        return res.status(500).send({ message: "Sever error", success: false });

    }
}