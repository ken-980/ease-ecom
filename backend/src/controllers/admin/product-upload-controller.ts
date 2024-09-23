import { Request, Response } from "express"
import { productUpLoaderService } from "../../services/admin/uploads/products-upload";
import { productDetails } from "../../types/types";
import { productDetailsServeSaveDb } from '../../services/db/admin/product-details';

const productUploadController = async (req: Request, res: Response) => {

    try {
        //upload files here
        if (!req.files) {
            //bad request
            return res.status(401).send({ success: false, message: "No files in request" });
        }

        if (Array.isArray(req.files)) {
            const reqFilesLength = req.files.length
            const fileArray = Array.from<Buffer>({ length: reqFilesLength })

            req.files.forEach((file) => {
                if (file) {
                    fileArray.push(file.buffer)
                }
            })

            const { productName, productPrice, productType, productGenderUse, productQuantity, adminId } = req.body;


            if (!productName || !productPrice || !productType || !productGenderUse || !productQuantity || !adminId) {
                return res.status(400).send({ success: false, message: "Missing data in the body" });
            }

            let productNameCon = "";
            //concatenating the strings
            if (productName.includes(" ")) {

                for (const t of productName.split(" ")) {
                    productNameCon += t;
                }
            }

            const urlsObjects = await productUpLoaderService(fileArray, productNameCon);

            if (!urlsObjects) {
                return res.status(500).send({ success: false, message: "Error uploading images" });
            }

            //pass val and body to service
            const reqBodyProductDetails: productDetails = { product_name: productName, product_type: productType, product_gender_use: productGenderUse, product_price: productPrice, product_quantity: productQuantity, admin_id: adminId }

            const prod = productDetailsServeSaveDb(urlsObjects, reqBodyProductDetails)

        }
        return res.status(401).send({ message: "Sever error", success: false });


    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: "Sever error", success: false });
    }
}

export default productUploadController;