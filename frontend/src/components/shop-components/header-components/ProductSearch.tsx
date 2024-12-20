import { Form } from "react-router-dom";


const ProductSearch = () => {

    return(
        <div>
            <Form>
                <label className="relative block" htmlFor="product_search">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </span>

                    <input type="text" name="product" id="product_search" 
                    className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border font-plus-font py-2 pl-9 pr-3 shadow-sm focus:outline-none sm:text-sm" placeholder="Search for anything..." />
                </label>
            </Form>
        </div>
    )
}

export default ProductSearch;