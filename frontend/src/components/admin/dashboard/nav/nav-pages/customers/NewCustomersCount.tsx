import { Link } from "react-router-dom"

export const NewCustomersCount = () => {
    return (
        <div className="p-4 rounded h-32 shadow bg-green-50 space-y-4">
            <h5 className="text-gray-500 text-wrap font-plus-font"> New customers </h5>
            <h3 className="text-3xl text-wrap font-bold font-plus-font"> 20 customers </h3>

            <Link className="text-sm font-plus-font my-1 hover:bg-gray-200 hover:rounded px-1 hover:text-green-500 text-green-500" to={"#"}> View all  </Link>

        </div>
    )
}