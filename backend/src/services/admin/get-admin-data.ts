import { prismaClientInstance } from "../../db/prismaClient";



/**
 * Get user data from db;
 * @param {string} adminUserName 
 * @returns {Promise}
 */

export const getAdminData = async (adminUserName: string): Promise<object | null> => {

    try {



        const adminData = await prismaClientInstance.admin.findUnique({
            where: {
                userName: adminUserName
            },
            select: {
                id: true,
                userName: true,
                createdAt: true
            }
        })

        if (!adminData) {
            return null;
        }

        return adminData;

    } catch (error) {
        console.log(`Database error => ${error}`);
        return null;
    }
}