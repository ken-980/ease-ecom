import jwt from "jsonwebtoken"
import ms from "ms";


/**
 * 
 * @param adminName 
 * @returns string | null
 */
export const jwtTokenGen = (adminName: string) => {

    try {

        const secret: string | undefined = process.env.JWT_SECRET;
        if (typeof secret === 'string') {
            return jwt.sign({ adminName }, secret, { expiresIn: ms("1d") });
        }
        return null;
    } catch (error) {
        console.log(`jwt error => ${error}`);
        return " ";
    }

}