import { ActionFunction } from "react-router";
import { axiosInstance } from "../../lib/axios-instance";
import { AxiosError } from "axios";

export const InventoryActionFuncion : ActionFunction = async ({ request }) => {

    try {
        
        const formData = await request.formData();
        
        const intent = formData.get("del");

        const axios_req = await axiosInstance({
            data : { intent },
            method : "delete",
            url : "/admin/del",
            withCredentials : true
        })

        console.log(axios_req)

        return null;
    } catch (error) {
        console.log(error)
        if(error instanceof AxiosError){
            console.log(error.response?.data)
        }
        return null;
    }
}