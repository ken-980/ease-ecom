import { prismaClientInstance } from "../../../db/prismaClient";



//add new admin to db
export const addNewAdmin = async (newUsername: string, newPassword: string): Promise<boolean> => {

    try {

        const newAdmin = await prismaClientInstance.admin.create({
            data: {
                userName: newUsername,
                password: newPassword
            }
        })
        return true;
    } catch (error) {
        console.log(`Database error => ${error}`);
        return false;
    }
}