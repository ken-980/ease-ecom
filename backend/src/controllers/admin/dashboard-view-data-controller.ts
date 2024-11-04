import { Request, Response } from "express"



//loads admin dashboard data 
export const dashboardViewDataController = async (req: Request, res: Response) => {
    console.log("Hit")

    return res.status(200).send({ success: false, message: "received" });
}