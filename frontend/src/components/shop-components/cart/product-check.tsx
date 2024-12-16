import { DeleteSvgIcon } from "../../common/delet-svg-icon"
import { Form } from 'react-router-dom';


export const ProductsCartCheck = () => {

    //cart view
    return(
        <div className="flex w-full p-5">
            
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
                <div className="mt-4 flex justify-between items-center">

                    <div className="flex w-1/3 space-x-3 items-center">
                        <input type="checkbox" name="#" id="#" />
                        <img className="w-16 rounded-md" src="https://i.pravatar.cc/150?img=3" alt="product" />

                        <div className="font-plus-font">
                            <h5 className="text-sm font-bold mt-2"> Product name</h5>
                            <h6 className="text-sm text-slate-400 mt-1"> Product type </h6>
                        </div>
                    </div>

                    <div className="font-plus-font w-auto flex flex-col justify-center items-center">
                        <div className="border rounded-md space-x-3 px-4 py-1">
                            <button>-</button>
                            <span className="text-sm">1</span>
                            <button>+</button>
                        </div>

                        <button className="flex items-center space-x-1 mt-2 text-sm"> 
                            <DeleteSvgIcon />
                            <span>Remove</span> 
                        </button>

                    </div>

                    <div className="w-auto text-center">
                        <span> $ 400 </span>
                    </div>
                </div>
            
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
    )

}