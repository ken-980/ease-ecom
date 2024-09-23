import  { AxiosError } from "axios";
import { axiosInstance } from "../../lib/axios-instance";
import { ProductsInfo, InventoryPageInfo, InventoryProductInfo } from '../../types/products';


export const inventoryPageLoader = async () => {
 
    try {

        //get recent items, total products, total products, pending orders
        const axios_req = await axiosInstance({
            method : "get",
            url : "admin/recent/6",
            withCredentials : true
        })

        if(axios_req.status !== 200){
            return null;
        }
        const productArray : ProductsInfo[] = [];

        if(Array.isArray(axios_req.data?.products)){
            const items = axios_req.data?.products as InventoryPageInfo[]
            items.map((item) => {
                
                if(Array.isArray(JSON.parse(item.productFilePath))){
                    const js = JSON.parse(item.productFilePath)
                    productArray.push({productName : item.productName, productId : item.id, productPrice : item.productPrice, productImage : js[0]?.imageUrl})
                }
            })
        }

        const data : InventoryProductInfo = { products : productArray, totalProducts : axios_req.data?.totalRecords, totalInventoryProducts : axios_req.data?.totalProductsInventory }

        return data;
        
    } catch (error) {
        if(error instanceof AxiosError){
            console.log(error.response)
        }
        return null;
    }
}