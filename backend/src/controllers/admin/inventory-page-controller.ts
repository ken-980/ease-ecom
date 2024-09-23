import { Request, Response } from "express"
import { limitQuery } from "../../services/db/admin/numbered-query";
import { countTotalProduct } from "../../services/db/admin/count-query";
import { totalInventory } from "../../services/db/admin/total-product-inventory";

export const recentProductController = async (req: Request, res: Response) => {


    //get quantity of items
    if (!req.params?.productNumber) {
        return res.status(400).send({ success: false, message: "No data in db" });
    }

    const productQuantity = Number(req.params?.productNumber);

    const results = await limitQuery(0, productQuantity);

    const recordsCount = await countTotalProduct();

    const inventoryCount = await totalInventory();

    if (!inventoryCount) {
        return res.status(200).json({ success: true, message: "data retrieved", products: results, totalRecords: recordsCount, totalProductsInventory: 0 });
    }

    if (!results) {
        return res.status(400).send({ success: false, message: "No data in db" });
    }
    return res.status(200).json({ success: true, message: "data retrieved", products: results, totalRecords: recordsCount, totalProductsInventory: inventoryCount });
}