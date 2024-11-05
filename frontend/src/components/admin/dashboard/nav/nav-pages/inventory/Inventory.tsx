import { useLoaderData, useNavigation } from "react-router"
import { AddProductForm } from "./AddProductForm"
import { ProductsTable } from "./products/ProductTable"
import { InventoryProductInfo } from "../../../../../../types/products-types"


export const Inventory = () => {

    const {totalProducts, totalInventoryProducts } = useLoaderData() as InventoryProductInfo
    const navigation = useNavigation();
    return (
        <div className="px-6 py-4 mt-3">

            <div className="flex justify-between space-x-2">
                <div className="w-1/4 p-4 rounded h-32 shadow bg-gray-200 space-y-4">
                    <h5 className="text-gray-500 font-plus-font"> Total Inventory Products </h5>
                    <h3 className={`${navigation.state === "loading" ? "animate-pulse" : ""} text-3xl font-bold font-plus-font`}> {totalInventoryProducts} Products </h3>
                </div>
               
               
                <div className="w-1/4 p-4 rounded h-32 shadow  bg-gray-200 space-y-4">
                    <h2 className="text-gray-500 font-plus-font"> Total Products </h2>
                    <h3 className={`${navigation.state === "loading" ? "animate-pulse" : ""} text-3xl font-bold font-plus-font ${totalProducts <= 10 ? "text-red-400" : "text-green-400"} `}> {totalProducts} Products </h3>
                </div>
                
                <div className="w-1/4 p-4 rounded h-32 shadow  bg-gray-200 space-y-4">
                    <h2 className="text-gray-500 font-plus-font"> Current Pending Orders </h2>
                    <h3 className="text-3xl font-bold font-plus-font"> 78 Products </h3>
                </div>
            </div>

            <div className="flex  mt-8 space-x-2  h-96">
                
                <div className="w-2/5 p-4 border shadow-sm">
                    <div className="flex justify-between px-2">
                        <div>
                            <h3 className="text-gray-700 font-plus-font"> Add Product </h3>
                        </div>
                    </div>

                    <div>
                        <AddProductForm />
                    </div>
                </div>

                <div className="w-3/5 p-2 border shadow-sm">
                    <h2 className="text-gray-700 font-plus-font"> Recently added Products  </h2> 
                    <ProductsTable /> 

                    <div className="mt-4">
                        <a className="px-3 py-2 font-plus-font border border-gray-500 hover:bg-white hover:text-black transition-colors bg-black text-white" href="#" > View all products </a>
                    </div>                  
                </div>

            </div>
        </div>
    )
}