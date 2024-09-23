import { LoaderFunction, redirect } from "react-router";
import axios, { AxiosError } from "axios";
import { baseUrl } from "../../configs";


/**
 * Admin home loader function
 * @returns {Promise} admin data for dashboard
 */
export const adminHomeLoaderFunction : LoaderFunction = async () : Promise<object | null> => {

    try {
        
        //read admin username form localstorage
        const adminUsernameLocalStorageData = localStorage.getItem("uname");

        //error checks
        if(!adminUsernameLocalStorageData || typeof adminUsernameLocalStorageData !== "string"){
            return redirect("/admin");
        }else{
            const jsonLocalStorageData = JSON.parse(adminUsernameLocalStorageData)

            /* Get admin data for dashboard */
            const getReq = await axios({
                method : "get",
                withCredentials : true,
                url : `/admin/adminData/${jsonLocalStorageData}`,
                baseURL : `${baseUrl}`
            });

            if(getReq.status !== 200){
                return redirect("/admin");
            }
        
            return getReq.data?.resData;
        }
    } catch (error){

        if(error instanceof AxiosError){
            console.log(error.response?.data)
        }
        return redirect("/admin");
    }
} 