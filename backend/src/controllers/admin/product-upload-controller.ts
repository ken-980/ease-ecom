import { Request, Response } from "express"
import { productUpLoaderService } from "../../services/admin/cloudinary/products-upload";
import { productDetails } from "../../types/product-types";
import { productDetailsServeSaveDb } from '../../services/db/admin/product-details-service-db';
import { logger } from "../../../logger";

const productUploadController = async (req: Request, res: Response) => {
    try {

        //upload files here
        if (!req.files) {
            //bad request
            return res.status(401).send({ success: false, message: "No files in request" });
        }

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
            const reqBodyProductDetails: productDetails = { product_name: productName, product_type: productType, product_gender_use: productGenderUse, product_price: productPrice, product_quantity: productQuantity, admin_id: adminId }

            //save product details to database
            const dataSaved = await productDetailsServeSaveDb(urlsObjects, reqBodyProductDetails)

            //successful data saved 
            if (dataSaved) {
                return res.status(200).send({ message: "Data saved", success: true });
            }

        }
        //error occured
        return res.status(401).send({ message: "Sever error", success: false });

    } catch (error) {
        logger.log({ level: "error", message: `Error in upload service: ${error}` })

        return res.status(500).send({ message: "Sever error", success: false });
    }
}

export default productUploadController;