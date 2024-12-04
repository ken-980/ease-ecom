import { logger } from "../../../logger";

import { Request, Response } from 'express';
import { singleImageUpLoaderService } from "../../services/admin/cloudinary/upload-single-image";
import { addProductMainPhoto } from "../../services/db/admin/add-product-main-photo";
import { checkProductExists } from "../../services/db/admin/check-product-exists";


export const mainProductImageController = async (req: Request, res: Response) => {


	try {

		if (!req.file || !req.body?.productId) {
			return res.status(400).send({ success: false, message: "No file or productId in request" });
		}

		//check of product exists
		const productExist = await checkProductExists(Number(req.body?.productId));


		if (!productExist) {
			return res.status(400).send({ success: false, message: "Product ID does not exist" });
		}

		//pass file buffer to upload
		const mainLink = await singleImageUpLoaderService(req.file.buffer);

		if (typeof mainLink === "string") {
			addProductMainPhoto(mainLink, req.body?.productId);
		}

		return res.status(200).send({ success: true, message: "Image Added" });

	} catch (error) {
		logger.log({ level: "error", message: `Error in upload service: ${error}` })
		return res.status(500).send({ success: false, message: "Server error" });
	}

}