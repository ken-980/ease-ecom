import { DeleteSvgIcon } from "../../common/delet-svg-icon"
import { Form } from 'react-router-dom';
import { ProductSummary } from "./product-summary";
import { HeaderMain } from "../header-components/HeaderMain";


export const ProductsCartCheck = () => {

    //cart view
    return(
        <>
            <div className="mt-5 mx-32">
                <HeaderMain />
            </div>

            <div className="flex w-full mt-20 px-32">
                
                <div className="w-1/2">
                
                    <div className="flex justify-between items-center px-3">
                        <h3 className="font-bold font-plus-font text-3xl"> Cart </h3>

                        <button className="font-plus-font  flex space-x-1" > 
                            <DeleteSvgIcon />
                            <span> Remove </span>
                        </button>
                    </div>


                    {/* header */}
                    <div className="flex justify-between p-3 text-slate-600 uppercase text-sm font-bold mt-6 font-plus-font border-b">
                        <div className="space-x-3"> 
                            <input type="checkbox" name="#" id="#" />
                            <span> Product </span>
                        </div>
                        <div>
                            <span> Quantity </span>
                        </div>
                        <div>
                            <span> Price </span>
                        </div>
                    </div>


                    {/* list */}
                    <ProductSummary />

               

               
                
                </div>

                <div className="w-1/2 flex flex-col space-y-3 justify-center items-center text-center p-5">
                <div className="w-80  flex justify-between">
                        <p className="font-plus-font text-slate-500">Subtotal</p>
                        <span className="font-bold font-plus-font">$25,500</span>
                </div>

                <div className="w-80  flex justify-between border-b">
                        <p className="font-plus-font text-slate-500">Discount</p>
                        <span className="font-bold font-plus-font text-slate-500">$0</span>
                </div>

                <div className="w-80  flex justify-between border-b">
                        <p className="font-plus-font text-slate-500">Grand total</p>
                        <span className="font-bold font-plus-font">$25,510</span>
                </div>
                    <Form>
                        <button className="bg-black text-white font-plus-font w-80 p-2 rounded ">Checkout now</button>
                    </Form>
                </div>
            </div>

        </>        
    )

}