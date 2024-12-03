import { logger } from "../../../logger";

import { Request, Response } from 'express';
import { singleImageUpLoaderService } from "../../services/admin/cloudinary/upload-single-image";


export const mainProductImageController = async (req: Request, res: Response) => {


	try {

		if (!req.file || !req.body?.productId) {
			return res.status(400).send({ success: false, message: "No file or productId in request" });
		}

		//pass file buffer to upload
		// const imageUrl = await singleImageUpLoaderService(req.file.buffer)
		console.log(req.body?.productId);
		return res.status(200).send({ success: true, message: "image uploaded" });


	} catch (error) {
		logger.log({ level: "error", message: `Error in upload service: ${error}` })
		return res.status(500).send({ success: false, message: "Server error" });

	}

}