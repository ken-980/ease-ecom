// src/types/inventory.ts

export interface InventoryStatsDTO {
  totalProducts: number;
  outOfStockCount: number;
  totalStockValuation: number; // Calculated on backend: SUM(productPrice * productQuantity)
  activeBrandsCount: number;
}

export interface InventorySummaryItemDTO {
  id: number;
  productBrand: string;
  productName: string;
  productType: string;
  productQuantity: number;
  productPrice: number; // Normalized to number from Prisma Decimal
  thumbnailUrl: string | null; // Only the single isMain: true image
  createdAt: string; // ISO 8601 timestamp
}

export interface InventoryOverviewResponse {
  success: boolean;
  stats: InventoryStatsDTO;
  recentProducts: InventorySummaryItemDTO[]; // Capped at 20 on backend
}

// Used later for /admin/:adminId/inventory/all (Full Catalog with Server Pagination)
export interface PaginatedCatalogResponse {
  success: boolean;
  items: InventorySummaryItemDTO[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

// Used later for View & Edit Product pages (Full Media + Rich Text Description)
export interface ProductMediaDTO {
  id: number;
  url: string;
  publicId: string;
  type: 'IMAGE' | 'VIDEO';
  isMain: boolean;
}

export interface ProductDetailDTO extends InventorySummaryItemDTO {
  productGenderUse: string;
  productDescription: string | null;
  productValue: number | null;
  adminUsername: string;
  media: ProductMediaDTO[];
}

export interface EditProductLoaderData {
  product: ProductDetailDTO | null;
  error?: string;
}

export interface EditProductActionData {
  success?: boolean;
  message?: string;
  error?: string;
  submittedAt?: number;
  fieldErrors?: Partial<
    Record<
      | 'productBrand'
      | 'productName'
      | 'productType'
      | 'productGenderUse'
      | 'productPrice'
      | 'productQuantity'
      | 'media',
      string
    >
  >;
}