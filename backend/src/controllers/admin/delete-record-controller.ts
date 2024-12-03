import { Request, Response } from "express"
import { deleteRecord } from "../../services/db/admin/delete-record"

export const deleteRecordController = async (req: Request, res: Response) => {

    if (!req.body?.productId) {
        return res.status(400).send({ success: false, message: "No data id" });
    }

    const del = await deleteRecord(req.body?.productId);

    if (del) {
        return res.status(200).send({ success: true, message: " Record deleted successfully " });
    }
    return res.status(500).send({ success: false, message: "Server error" });


}