import { prismaClientInstance } from "../../../db/prismaClient";



export const getPassword = async (newUsername: string): Promise<string | null> => {

    try {


        const user = await prismaClientInstance.admin.findUnique({
            where: {
                userName: newUsername
            },
            select: {
                password: true
            }
        })

        if (!user) {
            return null;
        }
        return user.password;

    } catch (error) {
        console.log(`Database  error in get_password => ${error}`);
        return null;
    }

}