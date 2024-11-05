import { Link } from "react-router-dom"

type SalesCountProps = {
    productsCount : number
}

export const SalesCount = ({productsCount} : SalesCountProps) => {

    return(
        <div>
            <div className="p-4 rounded h-32 shadow bg-green-50 space-y-4">
                <h5 className="text-gray-500 font-plus-font"> Total Inventory volume </h5>
                <h3 className="text-3xl font-bold font-plus-font"> {productsCount} Products </h3>
            <Link className="text-sm font-plus-font my-1 hover:bg-gray-200 hover:rounded px-1 hover:text-green-500 text-green-500" to={"#"}> View all  </Link>

            </div>
        </div>
    )
}