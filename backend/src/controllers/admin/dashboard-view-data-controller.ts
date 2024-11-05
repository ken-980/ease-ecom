import { Request, Response } from "express"
import { logger } from "../../../logger";
import { totalInventory } from "../../services/db/admin/total-product-inventory";
import { DashboardViewData } from "../../types/product-types";
import { productValue } from "../../services/db/admin/get-product-price";


//loads admin dashboard data 
export const dashboardViewDataController = async (req: Request, res: Response) => {

    try {

        //total products inventory service
        const totalProducts = await totalInventory();

        //total product value
        const value = await productValue();

        if (typeof totalProducts === "number" && typeof value === "number") {

            const viewData: DashboardViewData = { inventoryValue: value, inventoryVolume: totalProducts };

            return res.status(200).send({ success: true, message: "data", data: viewData });

        }

        return res.status(400).send({ success: false, message: "Unkwon error" });

    } catch (error) {
        logger.log({ level: "error", message: `Error in upload service: ${error}` })
        return res.status(500).send({ success: false, message: "Sever Error" });

    }
}
