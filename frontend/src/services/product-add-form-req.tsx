import axios, { AxiosError } from "axios";
import { baseUrl } from "../configs";


export const axiosReqUserData = async (formData : FormData) : Promise<string> => {

    try {
        
        const axios_req =  await axios({
            method : "post",
            data : formData,
            withCredentials : true,
            url : "/admin/product-upload",
            baseURL : `${baseUrl}`,
            headers : {
                "Content-Type" : "multipart/form-data"
            }
        });

        if(axios_req.status !== 200){
            return axios_req.data?.message
        }

        return ""
    } catch (error) {
        if(error instanceof AxiosError){
            return error.response?.data?.message
        }
        return "";
    }

}