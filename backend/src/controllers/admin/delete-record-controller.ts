import { Request, Response } from "express"
import { deleteRecord } from "../../services/db/admin/delete-record"

export const deleteRecordController = async (req: Request, res: Response) => {



    console.log()
    if (!req.body?.intent) {
        return res.status(400).send({ success: false, message: "No data id" });
    }

    const del = await deleteRecord(req.body?.intent);

    if (del) {
        return res.status(400).send({ success: false, message: " Record deleted successfully " });
    }
    return res.status(500).send({ success: false, message: "Server error" });


}