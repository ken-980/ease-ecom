

export interface HomepageLoaderType {
    id: number
    productName: string
    productDescription: string
    mainPhoto: MainPhoto
    productPrice: number
}

interface MainPhoto {
    id: number,
    photoLink: string
    productId: number
}

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