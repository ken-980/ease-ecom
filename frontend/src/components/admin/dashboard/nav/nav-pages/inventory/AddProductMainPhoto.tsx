import { Form, useActionData } from "react-router-dom"



export const AddProductMainPhoto = () => {

    const actionData = useActionData() as string

    return(
        <Form method="post" encType="multipart/form-data">
            <div className="mt-10 border shadow-sm space-y-4 py-3 px-4">
                <div>
                    <label htmlFor="productId">
                        <span className="block text-sm font-thin text-slate-800 font-plus-font"> Product ID </span>
                        <input type="number" name="productId"placeholder="productId" id="ProductId" className="border focus:outline-none focus:border-sky-700 p-2 font-plus-font text-sm text-gray-600 bg-gray-200 w-64"/>
                    </label>
                </div>
                <div>
                    <label htmlFor="mainPhoto">
                        <span className="block text-sm font-thin text-slate-800 font-plus-font"> Main Photo</span>
                        <input type="file" name="mainPhoto" id="main-photo" className="border focus:outline-none focus:border-sky-700 p-2 font-plus-font text-sm text-gray-600 bg-gray-200 w-64"/>
                    </label>
                </div>

                <button type="submit" name="intent" value="uploadMainPhoto" className="text-gray-50 font-plus-font text-center px-4 py-2 bg-black"> Upload Main Photo </button>

                {actionData && <p className="text-red-500">{actionData}</p>}
            </div>
    </Form>
    )
}