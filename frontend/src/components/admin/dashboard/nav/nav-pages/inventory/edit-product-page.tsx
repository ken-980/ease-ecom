import { useLoaderData,useParams,Form, useSubmit } from "react-router-dom"
import { LoadAnimationCircle } from '../../../../../common/LoadAnimation';
import { FormEvent, useRef, useState } from "react";
import { EditProductInfo } from "../../../../../../types/products";


export const  EditProduct = () => {

    const { adminId } = useParams();
	const { productId } = useParams()
	const submit = useSubmit();

    const  { productDetail, productImages } = useLoaderData() as EditProductInfo;



	//image links array
	const imageUrls : string[] = [];

	//remove images link from array or push
	const selectHandler : React.ComponentProps<"input">["onChange"] = ( event ) => {
		const url = event.target.value;

		const elemIndex = imageUrls.indexOf(url)

		if(elemIndex == -1){
			imageUrls.push(url);
		}else{
			imageUrls.splice(elemIndex, 1);
		}
	}

	//images 
    const images = productImages.map((url, index) => 
        <div className={`p-2 m-2`}  key={index}>
			<input type="checkbox" value={url} className={`checked:bg-red-500`} onChange={selectHandler} name={url}  />
			<img className="size-28" src={url} alt="no-photo(s)" />
        </div>
    )

	//form submitting loader and submit button disabler
    const [loading, setLoading ] = useState(false);

	//input missing error
	const [inputMissingError, setInputMissingError] = useState(""); 

    const fileInputRef = useRef<HTMLInputElement | null> (null);
	const productNameInputRef = useRef<HTMLInputElement | null>(null)
	const productPriceInputRef = useRef<HTMLInputElement | null>(null)
	const productTypeInputRef = useRef<HTMLSelectElement | null>(null)
	const productGenderUse = useRef<HTMLSelectElement | null>(null)
	const productProductQuantity = useRef<HTMLInputElement | null>(null)
	const productAdminRef = useRef<HTMLInputElement | null>(null)



	//handle form submit
    async function handleFormSubmission(event : FormEvent){
       
		
        setLoading(true)

        event.preventDefault();
    
        const formData = new FormData();    
        
		//populate the images array
        if (fileInputRef.current && fileInputRef.current.files) {
            Array.from(fileInputRef.current.files).forEach((file) => formData.append("product-images", file));
        }

		if(
            productNameInputRef.current?.value  && 
            productAdminRef.current?.value && 
            productGenderUse.current?.value && 
            productPriceInputRef.current?.value && 
            productProductQuantity.current?.value && 
            productTypeInputRef.current?.value
			
        ){
			formData.append("productName", productNameInputRef.current.value);
			formData.append("productPrice", productPriceInputRef.current.value);
			formData.append("productType", productTypeInputRef.current.value);
			formData.append("productGenderUse", productGenderUse.current.value);
			formData.append("productQuantity", productProductQuantity.current.value);
            formData.append("adminId", productAdminRef.current.value);
			

			if(imageUrls.length !==0 ){
				const imagesToDelete = imageUrls.map((url) => ({ url }) )
				const jsonUrl = JSON.stringify(imagesToDelete)
				formData.append("delete-link", jsonUrl)
			}
			console.log(adminId)

			submit(formData, {method:"post", action : `/admin/${adminId}/edit/${productId}`});


			//formData to service
			//react-router useSubmit not working
			//await axiosReqUserData(formData);

		}else{
			setInputMissingError("Input missing");
		}


		// setInputMissingError(axios_req);
		
		//end loading state
        setLoading(false);
    } 

    return (
		//refactor this form

		//whole page
        <div className="flex justify-center space-x-6 items-center p-4">

			{/* form  */}
            <div className="mt-4">
                <Form className="p-2 space-y-8" method="post" encType="multipart/form-data" onSubmit={handleFormSubmission}>

                    <div className="flex space-x-4 m-1">
                        <label htmlFor="product-name ">
                            <span className="block text-sm font-thin text-slate-800 font-plus-font"> Product name </span>
                            <input className="border focus:outline-none focus:border-sky-700 p-2 font-plus-font text-sm text-gray-600 bg-gray-200 w-64" ref={productNameInputRef} type="text" name="productName" value={productDetail.productName} id="product-name" required/>
                        </label>

                        <label htmlFor="product-price">
                            <span className="block text-sm font-thin text-slate-800 font-plus-font"> Product price (Ghc)</span>
                            <input className="border focus:outline-none p-2 focus:border-sky-700 font-plus-font text-sm text-gray-600 bg-gray-200 w-64"    pattern="[0-9]*[.,]?[0-9]*"  ref={productPriceInputRef} value={productDetail.productPrice} type="number" name="productPrice" id="product-price" required/>
                        </label>
                    </div>

                    <div className="flex space-x-4 m-1 items-center ">
                        <label htmlFor="product-type">
                            <span className="block text-sm font-thin text-slate-800 font-plus-font">Product type</span>
                            <select className="w-full p-2 bg-gray-200 outline-none font-plus-font" value={productDetail.productType} name="productType" required ref={productTypeInputRef} id="product-type">
                                <option value="Cologne">Cologne</option>
                                <option value="Eau de tollette">Eau de tollette</option>
                                <option value="Eau de perfume">Eau de perfume</option>
                                <option value="Parfum">Perfume</option>
                            </select>
                        </label>

                        <label htmlFor="product-gender">
                            <span className="block text-sm font-thin text-slate-800 font-plus-font">Gender</span>
                            <select className="w-full p-2 bg-gray-200 outline-none border-none font-plus-font" name="gender" value={productDetail.productGenderUse}  id="product-gender" ref={productGenderUse}>
                                <option value="male">Male</option>
                                <option value="femal">Female</option>
                            </select>
                        </label>


                        <label htmlFor="product-quantity">
                            <span className="block text-sm font-thin text-slate-800 font-plus-font">Quantiy</span>
                            <input  value={productDetail.productQuantity} type="number" id="product-quantity" name="product_quantity" className="border focus:outline-none focus:border-sky-700 p-2 font-plus-font text-sm text-gray-600 bg-gray-200"ref={productProductQuantity} />
                        </label>

                        <input type="text"  ref={productAdminRef} name="admin_id" readOnly value={adminId} hidden    />
                    </div>

                    <div>

                        <label htmlFor="product-image">
                            <span className="block text-sm font-thin text-slate-800 font-plus-font">Add product images</span>
                            <input ref={fileInputRef} type="file" id="product-image" multiple name="product-images" max={4} className=" w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 font-plus-font" accept="image/*" required/>
                        </label>
                    </div>

                    <button className="text-gray-50 font-plus-font text-center px-4 py-2 bg-black" disabled={loading} type="submit"> { loading ? <LoadAnimationCircle /> : "Edit" }  </button>

                    <span className="text-sm text-red-500"> {inputMissingError}</span>
                </Form>

            </div>



			{/* images */}
			<div  className="flex flex-wrap">
				{images}
			</div>

        </div>
    )
}