import { ActionFunction } from "react-router";
import { axiosInstance } from "../../lib/axios-instance";
import { AxiosError } from "axios";

export const InventoryActionFuncion : ActionFunction = async ({ request }) => {

    try {
        
        const formData = await request.formData();
        
        
        //get intention of submit button
        const intent = formData.get("del");

        if(intent === "del"){
            console.log
            await axiosInstance({
                data : { intent },
                method : "delete",
                url : "/admin/del",
                withCredentials : true
            })
        
        }
        

        if(intent === "uploadMainPhoto"){  
            const {productId} = Object.fromEntries(formData)

            if(productId === "" || !productId){
                return "No product Id"
            }
  
            console.log("upload photos")
        }

        return null;
    } catch (error) {
        console.log(error)
        if(error instanceof AxiosError){
            console.log(error.response?.data)
        }
        return null;
    }
}