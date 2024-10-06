import { useLoaderData, useNavigation, useParams } from "react-router";
import { InventoryProductInfo } from "../../../../../../../types/products";
import { Form } from "react-router-dom";
import { Link } from "react-router-dom";

export const ProductsTable = () => {


    const { adminId } = useParams();
    const { products } = useLoaderData() as InventoryProductInfo;
    
    const navigation = useNavigation()

    const data = products.map((product, index) => 
            
            // using, list img not supported under a table tag
            <li className={`flex p-2 ${(index+1) % 2 ? "bg-white" : "bg-slate-200"}`} key={index}>
                <div className="w-1/5 text-center"> {index+1} </div>

                    <div className="w-1/5 text-center flex justify-center content-center"> 
                        <img className="size-10" loading="lazy" src={product.productImage} />
                    </div>

                    <div className={`w-1/5 text-center font-plus-font text-sm font-medium text-ellipsis overflow-hidden capitalize`}>
                         {product.productName} 
                    </div>

                    <div className="w-1/5 text-center font-plus-font">
                         {product.productPrice} 
                    </div>

                    <div className="w-1/5 flex justify-center content-center space-x-2">
                        <Link to={`/admin/${adminId}/edit/${product.productId}`} className="bg-blue-500 p-2 text-white rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}   stroke="currentColor"     className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </Link> 

                        {/* form to delete product  */}
                        <Form method="post">
                            <button className="p-2 bg-red-500 text-white rounded" type="submit" value={product.productId} name="del">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </Form>  
                </div>
            </li>
        )
    


    return (
        // list heading
        <div className="m-1 overflow-auto">
            <div className="flex">
                <div className="border  w-1/5 text-center font-bold border-slate-400 p-2 font-plus-font text-sm">
                    <h4> # </h4>
                </div>
                <div className="border w-1/5 text-center font-bold border-slate-400 p-2 font-plus-font text-sm">
                    <h4> Image </h4>
                </div>
                <div className="border w-1/5 text-center font-bold border-slate-400 p-2 font-plus-font text-sm">
                    <h4> Product Name </h4>
                </div>
                <div className="border w-1/5 text-center font-bold border-slate-400 p-2 font-plus-font text-sm">
                    <h4> Price (GHC) </h4>
                </div>
                <div className="border w-1/5 font-bold text-center border-slate-400 p-2 font-plus-font text-sm">
                    <h4> Action </h4>
                </div>
            </div>
     

            <div>
                <ul className={navigation.state === "loading" ? "animate-pulse" : ""}>
                    {data}
                </ul>
            </div>

        </div>
    )
}