import { LoaderFunction } from "react-router";



export const dashboardLoader : LoaderFunction = async () => {
    try {
        
        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
}