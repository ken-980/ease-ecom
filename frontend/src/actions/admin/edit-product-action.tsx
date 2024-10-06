import { ActionFunction } from "react-router";
import { axiosInstance } from "../../lib/axios-instance";
import { baseUrl } from "../../configs";


/**
 * Load product data to edit 
 * 
 * @param param0 
 * @returns null 
 */
export const eidtProductAction : ActionFunction = async ({ request }) => {

    try {
        
        const formData = await request.formData();

        console.log(formData);
        
        //send product to edit details to backend
        const axios_req = await axiosInstance({
            method : "post",
            data :  formData,
            baseURL : `${baseUrl}`,
            url : "/admin/edit-product",
            withCredentials : true
        })

        console.log(axios_req);

        return null;

    } catch (error) {
        console.log(`Admin action error => : ${error}`);
        return null;
    }

}

