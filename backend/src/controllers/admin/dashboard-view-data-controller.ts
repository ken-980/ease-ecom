import { Request, Response } from "express";
import { logger } from "../../../logger";
import { getDashboardViewData } from "../../services/admin/get-dashboard-view-data-service";

export const dashboardViewDataController = async (req: Request, res: Response) => {
    try {
        const data = await getDashboardViewData();

        return res.status(200).send({ success: true, message: "data", data });

    } catch (error) {
        logger.log({ level: "error", message: `Error loading dashboard data: ${error}` });
        
        return res.status(500).send({ success: false, message: "Server Error" });
    }
};