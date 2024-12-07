
import { LoaderFunction } from "react-router";
import axios, { AxiosError } from "axios";
import { baseUrl } from "../../configs";


/**
 * Shop Home data loader
 * @returns {Promise} Main dashboard view data
 */
export const shopHomeLoader : LoaderFunction = async () : Promise<object | null> => {

    try {
        
            const response = await axios({
                method : "get",
                withCredentials : true,
                url : `/shop/shopHome?limit=10`,
                baseURL : `${baseUrl}`,
                timeout : 8000
            });


            if(response.status === 200){
                return JSON.parse(response.data?.responseData);
            }
        return null;
    } catch (error){

        if(error instanceof AxiosError){
            console.log(error.response?.data?.message)
        }
        return null;
    }
} 