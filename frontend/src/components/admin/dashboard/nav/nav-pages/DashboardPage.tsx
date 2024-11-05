import { SalesGraph } from "../../home/SalesGraph"
import { OrdersCount } from "./orders/OrdersCount"
import { RevenueCount } from "./revenue/RevenueCount"
import { SalesCount } from './sales/SalesCount';
import { NewCustomersCount } from "./customers/NewCustomersCount"
import { NewCustomers } from "../../home/NewCustomers"
import { Orders } from "../../home/Orders"
import { useLoaderData } from "react-router"
import { DashboardViewData } from "../../../../../types/products-types"

export const DashBoardPage = () => {

    const loader = useLoaderData() as DashboardViewData;

    return(
        <div className="px-6 py-4">
            <div className="flex justify-between space-x-2 flex-wrap">
                <div className="w-1/5">
                    <SalesCount  productsCount={loader.inventoryVolume}/>
                </div>
                <div className="w-1/5">
                    <RevenueCount revenue={loader.inventoryValue}/>
                </div>
                <div className="w-1/5">
                    <OrdersCount />
                </div>
                <div className="w-1/5">
                    <NewCustomersCount />
                </div>

                
            </div>

            <div className="mt-6">

                <div className="flex ">
                    {/* div for sales graph */}
                    <div className="w-4/6 grow">
                        <SalesGraph />
                    </div>
                    
                    <div className="w-2/6">
                        <NewCustomers />
                    </div>
                </div>


                {/* orders and low stock products */}
                <div className="flex mt-2">
                    <div className="w-4/6 grow">
                        <Orders />
                    </div>


                    <div className="w-2/6 grow">
                        <h2>low stock products</h2>
                    </div>
                </div>

            </div>
        </div>
    )
}