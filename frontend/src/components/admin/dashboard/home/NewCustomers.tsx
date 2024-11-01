import { Link, useParams } from "react-router-dom"


export const NewCustomers = () => {
    
    const {adminId} = useParams()
    return (
        <div className="shadow rounded-sm p-2">
            <div className="flex align-center justify-between">
                <h5 className="font-plus-font text-slate-700 text-sm p-2"> New customers </h5>
                <Link className="text-sm font-plus-font p-2  hover:text-green-300 text-green-500" to={`/admin/${adminId}/orders`}> All customers </Link>
            </div>

            <div className="mt-2 p-1">
                <div className="flex justify-between align-baseline border-b border-slate-200">
                    <h6 className="text-xs font-plus-font text-slate-500"> Name </h6>
                    <h6 className="text-xs font-plus-font text-slate-500"> spent </h6>
                </div>



                <div className="flex justify-between py-4">
                    
                    <div className="flex align-center space-x-2">
                        {/* image */}
                        <div>
                            <img className="h-10 rounded-full" src="https://i.pravatar.cc/150?img=3" alt="profile-image" />
                        </div>

                        {/* name  and email*/}
                        <div>
                            <h5 className="font-plus-font text-sm text-slate-700"> John Doe </h5>
                            <h6 className="text-xs font-plus-font text-slate-500"> test@email.com </h6>
                        </div>  
                    </div>

                
                    <div>
                        <h6 className="font-plus-font font-semibold text-sm text-slate-800"> $40.00 </h6>
                    </div>
                </div>

            


            </div>



        </div>
    )
}