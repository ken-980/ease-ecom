import { ActionFunction } from "react-router";
import { axiosInstance } from "../../lib/axios-instance";
import { AxiosError } from "axios";

export const InventoryActionFuncion : ActionFunction = async ({ request }) => {

    try {
        
        const formData = await request.formData();
        
        
        //get intention of submit button
        const intent = formData.get("intent");

        if(intent === "deleteProduct"){
            const {productId} = Object.fromEntries(formData)

            //for deletion of product
            await axiosInstance({
                data : { productId },
                method : "delete",
                url : "/admin/del",
                withCredentials : true
            })
        
        }
        
        if(intent === "uploadMainPhoto"){  
            const {productId} = Object.fromEntries(formData)

            //error checks
            if(productId === "" || !productId){
                return "No product Id"
            }

            const axiosReq = await axiosInstance({
                data: formData,
                method : "post",
                url : "/admin/mainProductPhoto",
                withCredentials : true
            })
            console.log(axiosReq.data)
            return axiosReq.data?.message;            
          }

        return null;
    } catch (error) {
        console.log(error)
        if(error instanceof AxiosError){
            console.log(error.response?.data?.message)
            
            return error.response?.data?.message
        }
        return null;
    }
}