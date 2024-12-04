
import { LoaderFunction } from "react-router";
import axios, { AxiosError } from "axios";
import { baseUrl } from "../../configs";


/**
 * Shop Home data loader
 * @returns {Promise} Main dashboard view data
 */
export const shopHomeLoader : LoaderFunction = async () : Promise<object | null> => {

    try {
        
            const getRequest = await axios({
                method : "get",
                withCredentials : true,
                url : `/shop/shopHome`,
                baseURL : `${baseUrl}`,
                timeout : 8000
            });


            console.log(getRequest.data?.data)


            if(getRequest.status === 200){
                return getRequest.data?.data;
            }
        return null;
    } catch (error){

        if(error instanceof AxiosError){
            console.log(error.response?.data)
        }
        return null;
    }
} 