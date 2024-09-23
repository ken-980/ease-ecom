import { ActionFunction,redirect } from "react-router";
import axios, { AxiosError } from "axios";
import { baseUrl } from "../../configs";

/**
 * Sign in Form Action
 * @param param0 
 * @returns {Promise}
 */
export const signInAction : ActionFunction = async ({request}) => {

    try {
        
        const formData = Object.fromEntries(await request.formData())

        const { username, password } = formData;
        if(!username || !password){
            return "Error: All Fields are required";
        }

        /**
         * post form-data to endpoint  
         */
        const axiosRes = await axios({
            method : "post",
            data : formData,
            withCredentials : true,
            url : "/admin/signin",
            baseURL : `${baseUrl}`
        });


        if(axiosRes.status !== 200){
            return axiosRes.data?.message;        
        }

        //save username in localstorage
        localStorage.setItem("uname", JSON.stringify(axiosRes.data?.username));

        //redirect to dashboard with admin id => username
        return redirect(`/admin/${axiosRes.data?.username}/dashboard`);

    } catch (error) {
    
        if(error instanceof AxiosError){
            return error.response?.data?.message;
        }
        return null;
    }

}