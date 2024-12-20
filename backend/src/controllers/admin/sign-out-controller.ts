import { Response, Request } from "express";
import { cookieName } from '../../configs/global-config';
import { logger } from "../../../logger";

const signOutController = async (req: Request, res: Response) => {

    try {
        const cookie = req.cookies[cookieName];
        if (!cookie) {
            res.status(401).send({ success: false, message: "session time out" });
            return;
        }
        res.cookie(cookieName, cookie, { maxAge: -1, httpOnly: true })

        res.status(200).send({ success: true, message: "session time valid" });
        return;

    } catch (error) {
        logger.log({ level: "error", message: `Sign out controller error: ${error}` })

        res.status(401).send({ success: false, message: "session time out" });
        return;
    }
}

export default signOutController;