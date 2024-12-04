import { Request, Response } from "express"
import userNameFromCookies from "../../services/admin/username-from-cookie";
import { getAdminData } from "../../services/admin/get-admin-data";
import { adminIdVerify } from '../../services/admin/admin-id-verify';
import { cookieName } from '../../configs/global-config';
import { logger } from "../../../logger";
const adminDetail = async (req: Request, res: Response) => {

    try {

        const username = userNameFromCookies(req.cookies[cookieName]);

        if (!username) {
            res.status(400).send({ message: "Invalid username", success: false });
            return;
        }
        //verify adminId witht cookie
        const userId = req.params?.adminId;

        const idValid = await adminIdVerify(userId, req.cookies[cookieName]);

        if (!idValid) {
            res.status(401).send({ message: "Invalid username", success: false });
            return;
        }

        //get admin data to send
        const data = await getAdminData(username);
        if (!data) {
            res.status(400).send({ message: "Invalid username", success: false });
            return;
        }

        res.status(200).send({ resData: data, success: true });
        return;

    } catch (error) {
        logger.log({ level: "error", message: `Error in admin detail controller: ${error}` })

        res.status(500).send({ message: "Server Error", success: false });
        return;
    }
}

export default adminDetail;