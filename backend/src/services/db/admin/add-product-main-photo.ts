import { id } from "../../../../jest.config";
import { prismaClientInstance } from "../../../db/prismaClient";



//add product main photo
export const addProductMainPhoto = async (): Promise<boolean> => {

    try {

        //relates, photoLink to ProductInfo (id)
        const newAdmin = await prismaClientInstance.productMainPhoto.create({
            data: {
                photoLink: "string",
                product: {
                    connect: {
                        id: 1
                    }
                }
            }
        })
        return true;
    } catch (error) {
        console.log(`Database error => ${error}`);
        return false;
    }
}