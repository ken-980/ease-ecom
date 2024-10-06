import { Response, Request } from "express"

export const editProductCrontroller = (req: Request, res: Response) => {

    console.log(req.body)

    res.send("ok");
    return;
}