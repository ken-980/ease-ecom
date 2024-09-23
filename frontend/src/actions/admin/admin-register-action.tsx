import { ActionFunction, redirect } from "react-router";
import  axios, { AxiosError }  from "axios"
import { baseUrl } from "../../configs";


/**
 * 
 * @param param0 react-router request object
 * @returns redirect to dashboard || null
 */
export const adminRegisterAction : ActionFunction = async ({ request }) => {

    try {

            const formData = Object.fromEntries(await request.formData());

            const { username, password, passwordConfirm } = formData;
            
            if(!username || !password || !passwordConfirm){
                return "Error: All Fields are required";
            }
        
            if(password !== passwordConfirm){
                return "Passwords do not match";
            }

        const axiosRes = await axios({
            method : "post",
            data : formData,
            withCredentials : true,
            url : "/admin/register",
            baseURL : `${baseUrl}`
        });

        
        if(axiosRes.status !== 201){

            return axiosRes.data?.message;            
        }
                
            //store username in localstorage
            localStorage.setItem("uname", JSON.stringify(axiosRes.data?.username));


            //redirect to dashboard with admin id => username
            return redirect(`/admin/${axiosRes.data?.username}/dashboard`);
    
        
    } catch (error) {

        if(error instanceof AxiosError){
            console.log(error?.response?.data?.message);
            return (error?.response?.data?.message)
        }
        return null;
    }

}