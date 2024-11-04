import { LoaderFunction } from "react-router";
import axios, { AxiosError } from "axios";
import { baseUrl } from "../../configs";


/**
 * Admin Dashboard view data loader
 * @returns {Promise} Main dashboard view data
 */
export const adminViewDataLoaderFunction : LoaderFunction = async () : Promise<object | null> => {

    try {
        
            const getReq = await axios({
                method : "get",
                withCredentials : true,
                url : `/admin/dashboardViewData`,
                baseURL : `${baseUrl}`,
                timeout : 8000
            });
            console.log(getReq.data)
        return null;
    } catch (error){

        if(error instanceof AxiosError){
            console.log(error.response?.data)
        }
        return null;
    }
} 