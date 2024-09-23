import { prismaClientInstance } from "../../../db/prismaClient";


export const checkAdminUsernameExist = async (newUsername: string): Promise<boolean> => {

    try {


        const user = await prismaClientInstance.admin.findUnique({
            where: {
                userName: newUsername
            }
        })

        return (user === null) ? false : true;

    } catch (error) {
        console.log(`Database error => ${error}`);
        return false;
    }

}