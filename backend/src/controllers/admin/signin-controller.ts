import { Request, Response } from "express"
import { getAdminByUsername } from "../../services/db/admin/get-admin-by-username";
import { jwtTokenGen } from "../../services/jwt-token-gen";
import ms from "ms";
import { getPassword } from "../../services/db/admin/get-password";
import { passwordDecode } from '../../services/password-decode';
import { cookieName } from "../../global-config";



/**
 * 
 * @param req 
 * @param res 
 * @returns admin credentials => admin username and Id
 */

const signInController = async (req: Request, res: Response) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).send({ message: "Data required", success: false });
            return;
        }

        const hashedPassword = await getPassword(username);

        if (!hashedPassword) {
            res.status(401).send({ message: "Invalid username or password", success: false });
            return;
        }

        const passwordDecoded = await passwordDecode(password, hashedPassword);

        if (!passwordDecoded) {
            res.status(401).send({ message: "Invalid username or password", success: false });
            return;
        }

        const adminIdByUsername = await getAdminByUsername(username);

        if (typeof adminIdByUsername !== null) {

            /* generate cookie token */
            const cookieToken = jwtTokenGen(username);

            res.cookie(cookieName, cookieToken, { maxAge: ms("1d"), httpOnly: true })

            if (!cookieToken) {

                return res.status(500).send({ message: "Sever error", success: false, data: {} });
            }

            //sends response data if everything is successful
            return res.status(200).send({ message: "signin", success: true, username: username, adminId: adminIdByUsername });
        }

        return res.status(401).send({ message: "Sever error try again", success: false });

    } catch (error) {
        console.log(`Server error => ${error}`);
        return res.status(401).send({ message: "Sever error try again", success: false });
    }

}

export default signInController;