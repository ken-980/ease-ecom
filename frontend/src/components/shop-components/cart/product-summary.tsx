import { DeleteSvgIcon } from "../../common/delet-svg-icon"

export const ProductSummary = () => {

    return(
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
    )
}