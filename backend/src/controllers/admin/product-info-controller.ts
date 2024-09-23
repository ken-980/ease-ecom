import { Request, Response } from "express"
import { productInfo } from "../../services/db/admin/get-product-info";

export const productInfoController = async (req: Request, res: Response) => {

    if (!req.params?.productId) {
        return res.status(401).send({ success: false, message: "No item id in request" });
    }

    const productId = Number(req.params?.productId);

    const productDetails = await productInfo(productId);

    res.status(200).send({ success: true, details: productDetails })
}