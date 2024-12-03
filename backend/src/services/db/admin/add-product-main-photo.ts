import { id } from "../../../../jest.config";
import { prismaClientInstance } from "../../../db/prismaClient";



//add product main photo
export const addProductMainPhoto = async (imageLink: string, productId: number): Promise<boolean> => {

    try {

        //relates, photoLink to ProductInfo (id)
        const newAdmin = await prismaClientInstance.productMainPhoto.create({
            data: {
                photoLink: imageLink,
                product: {
                    connect: {
                        id: Number(productId)
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