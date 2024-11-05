export interface InventoryPageInfo {
    adminUsername: string
    createdAt: string
    id: number
    productFilePath: string
    productGenderUse: string
    productName: string
    productPrice: string
    productQuantity: string
    updatedAt: string
}

export interface ProductDbInfo {
    adminUsername: string
    createdAt: string
    id: number
    productGenderUse: string
    productName: string
    productPrice: string
    productQuantity: string
    updatedAt: string
    productType: string
    productId?: number
}

export interface EditProductInfo {
    productDetail: ProductDbInfo,
    productImages: string[]
}



export interface ProductsInfo {
    productName: string
    productId: number
    productPrice: string
    productImage: string
}


export interface InventoryProductInfo {
    products: ProductsInfo[]
    totalProducts: number
    totalInventoryProducts: number
}


//dashboard data type
export interface DashboardViewData {
    inventoryVolume: number
    inventoryValue: number

}
