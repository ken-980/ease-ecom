import { Request, Response } from "express"
import coookieVerify from "../../services/admin/cookie-verify";
import { cookieName } from "../../configs/global-config";
import { logger } from "../../../logger";

const adminHomeController = async (req: Request, res: Response) => {

    try {

        const cookie = req.cookies[cookieName];

        if (!cookie) {
            return res.status(401).send({ success: false, message: "session time out" });
        }

        const cookieAuthenticity = coookieVerify(cookie, false);

        if (!cookieAuthenticity) {
            return res.status(401).send({ success: false, message: "session time out" });
        }

        return res.status(200).send({ success: true, message: "session time valid" });

    } catch (error) {
        logger.log({ level: "error", message: `Home Controller Error => : ${error}` })

        res.status(500).send({ success: true, message: "server error" });
    }
}

export default adminHomeController