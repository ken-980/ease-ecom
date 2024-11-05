export interface ImageUrls {
    imageUrl?: string,
}

export interface productDetails {
    product_name: string
    product_type: string
    product_gender_use: string
    product_price: string
    admin_id: string
    product_quantity: string
    productId?: number
}

//image public urls
export interface ImagePublicIds {
    public_id?: string
}

//images to delete link type
export interface ImagesType {
    url: string
}


//dashboard data type
export interface DashboardViewData {
    inventoryVolume: number
    inventoryValue: number
}
