import { useLoaderData } from "react-router";
import { HomepageLoaderType } from "../../../types/home-product-loader-return-types";


const Products = () => {

    const loaderData = useLoaderData() as HomepageLoaderType[];

    

    const products = loaderData.map((data, index) => 
            <div className="w-48 h-80 m-4" key={index}>
                <div>
                    <img className="object-cover w-full h-48 " src={data.mainPhoto.photoLink} alt="perfume" />
                </div>
                <div className="text-center">
                    <h3 className="font-sm font-alt-font">{data.productName}</h3>
                    <span className="text-xs font-plus-font">{data.productDescription}</span>
                    <h4 className="font-sm font-alt-font" >{`$${data.productPrice}`}</h4>
                </div>
                 <div className="text-center">
                    <button className="text-center rounded-full border border-slate-300 text-xs px-8 py-1 font-plus-font hover:bg-slate-300 " type="button"> Add to cart </button>
                </div>
            </div>

    )

    return (
        <div className="flex flex-wrap p-2 items-center justify-around">
            {products}
        </div>
    )
}

export default Products;