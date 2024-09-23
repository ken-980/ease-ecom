import { prismaClientInstance } from "../../../db/prismaClient";



export const getAdminByUsername = async (adminUserName: string): Promise<number | null> => {

    try {


        const adminData = await prismaClientInstance.admin.findUnique({
            where: {
                userName: adminUserName
            },
            select: {
                id: true
            }
        })

        if (!adminData) {
            return null;
        }

        return adminData.id;

    } catch (error) {
        console.log(`Database error => ${error}`);
        return null;
    }
}