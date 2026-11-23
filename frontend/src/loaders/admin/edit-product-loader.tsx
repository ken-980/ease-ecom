// src/loaders/admin/edit-product-loader.ts
import { LoaderFunction } from "react-router-dom";
import { isAxiosError } from "axios";
import { api } from "../../lib/axios-api";
import { showAlert } from "../../lib/alert-store";
import type { ProductDetailDTO } from "../../types/inventory";

export interface ProductDetailResponse {
  success: boolean;
  product: ProductDetailDTO;
}

export interface EditProductLoaderData {
  product: ProductDetailDTO | null;
  error?: string;
}

export const editProductPageLoader: LoaderFunction = async ({
  params,
}): Promise<EditProductLoaderData> => {
  const productId = params.productId;

  if (!productId) {
    const message = "Product ID is missing from the route.";
    showAlert({ variant: "error", message });
    return { product: null, error: message };
  }

  try {

    const { data } = await api.get<ProductDetailResponse>(
      `/admin/products/${encodeURIComponent(productId)}`,
      { skipGlobalErrorAlert: true },
    );

    return {
      product: data.product,
    };
  } catch (error) {
    let message = "Failed to load product details.";

    if (isAxiosError<{ message?: string }>(error)) {
      if (!error.response) {
        message =
          "Cannot reach the server. Check your connection or backend status.";
      } else if (error.response.status === 404) {
        message = "This product could not be found. It may have been deleted.";
      } else {
        message =
          error.response.data?.message ||
          `Server error (${error.response.status}) while loading product.`;
      }
    }

    showAlert({ variant: "error", message });
    return { product: null, error: message };
  }
};
