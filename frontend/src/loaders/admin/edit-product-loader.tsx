
import  { AxiosError } from "axios";
import { axiosInstance } from "../../lib/axios-instance";
import { LoaderFunction } from "react-router";
import { EditProductInfo, ProductDbInfo } from "../../types/products";


export const editProdcutPageLoader : LoaderFunction = async ({ params }) => {
 
    try {


        const productId = params?.productId;

        //get recent items, total products, total products, pending orders
        const axios_req = await axiosInstance({
            method : "get",
            url : `admin/product/${productId}`,
            withCredentials : true
        })

        if(axios_req.status !== 200){
            return null;
        }

        if(typeof axios_req.data?.details === 'object'){
            
            const product_details : ProductDbInfo  = {
                productGenderUse : axios_req.data?.details.productGenderUse,
                productName : axios_req.data?.details.productName,
                productPrice : axios_req.data?.details.productPrice,
                productQuantity : axios_req.data?.details.productQuantity,
                createdAt : axios_req.data?.details.createdAt,
                updatedAt : axios_req.data?.details.updatedAt,
                id : axios_req.data?.details.id,
                adminUsername : axios_req.data?.details.adminUsername,
                productType : axios_req.data?.details.productType
            };

            const images : string[] = [];
            const imageJson = JSON.parse(axios_req.data?.details.productFilePath);

            if(Array.isArray(imageJson)){

                imageJson.map((url) => {
                    images.push(url?.imageUrl)
                })
            }

            const d : EditProductInfo = { productDetail : product_details, productImages : images }
            return d;
        
        }

        // return data;
        return null
        
    } catch (error) {
        if(error instanceof AxiosError){
            console.log(error.response)
        }
        return null;
    }
}