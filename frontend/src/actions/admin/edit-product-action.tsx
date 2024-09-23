import { ActionFunction } from "react-router";


/**
 * Load product data to edit 
 * 
 * @param param0 
 * @returns null 
 */
export const eidtProductAction : ActionFunction = async ({ request }) => {

    try {
        
        const formData = await request.formData();

        for(const elem of formData.entries()){
            console.log(elem);
        }

        return null;

    } catch (error) {
        console.log(`Admin action error => : ${error}`);
        return null;
    }

}

