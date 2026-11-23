// src/actions/admin/edit-product-action.ts
import { ActionFunction } from "react-router-dom";
import { isAxiosError } from "axios";
import { api } from "../../lib/axios-api";
import { showAlert } from "../../lib/alert-store";
import { PRODUCT_CATEGORIES } from "../../constants/productCategories";
import { PRODUCT_FORM_FIELDS } from "../../constants/productFields";
import { TARGET_GENDERS } from "../../constants/productOptions";
import type { ProductActionData } from "../../pages/admin/inventory/AddProductPage";

// interface UpdateProductResponse {
//   success: boolean;
//   message?: string;
// }

const VALID_CATEGORIES = new Set<string>(
  PRODUCT_CATEGORIES.map((c) => c.value),
);
const VALID_GENDERS = new Set<string>(TARGET_GENDERS.map((g) => g.value));

const MAX_GALLERY_IMAGES = 6;
const MAX_VIDEOS = 2;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

const getTrimmedString = (formData: FormData, key: string): string => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};

const getNonEmptyFiles = (formData: FormData, key: string): File[] => {
  return formData
    .getAll(key)
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
};

export const editProductPageActionFunction: ActionFunction = async ({
  request,
  params,
}): Promise<ProductActionData> => {
  const productId = params.productId;

  if (!productId) {
    const message = "Missing product ID.";
    showAlert({ variant: "error", message });
    return { success: false, error: message };
  }

  const formData = await request.formData();

  const productBrand = getTrimmedString(
    formData,
    PRODUCT_FORM_FIELDS.productBrand,
  );
  const productName = getTrimmedString(
    formData,
    PRODUCT_FORM_FIELDS.productName,
  );
  const productType = getTrimmedString(
    formData,
    PRODUCT_FORM_FIELDS.productType,
  );
  const productGenderUse = getTrimmedString(
    formData,
    PRODUCT_FORM_FIELDS.productGenderUse,
  );
  const rawPrice = getTrimmedString(formData, PRODUCT_FORM_FIELDS.productPrice);
  const rawQuantity = getTrimmedString(
    formData,
    PRODUCT_FORM_FIELDS.productQuantity,
  );
  const productDescription = getTrimmedString(
    formData,
    PRODUCT_FORM_FIELDS.productDescription,
  );

  // Track existing media state passed via hidden inputs
  const hasExistingThumbnail =
    getTrimmedString(formData, "hasExistingThumbnail") === "true";
  const removedMediaIds = getTrimmedString(formData, "removedMediaIds");

  const thumbnailFiles = getNonEmptyFiles(
    formData,
    PRODUCT_FORM_FIELDS.thumbnail,
  );
  const newThumbnail = thumbnailFiles[0];

  const galleryFiles = getNonEmptyFiles(
    formData,
    PRODUCT_FORM_FIELDS.galleryImages,
  );
  const videoFiles = getNonEmptyFiles(formData, PRODUCT_FORM_FIELDS.videos);

  const fieldErrors: NonNullable<ProductActionData["fieldErrors"]> = {};

  if (!productBrand) {
    fieldErrors.productBrand = "Brand name is required.";
  } else if (productBrand.length > 100) {
    fieldErrors.productBrand = "Brand name must be 100 characters or fewer.";
  }

  if (!productName) {
    fieldErrors.productName = "Product name is required.";
  } else if (productName.length > 150) {
    fieldErrors.productName = "Product name must be 150 characters or fewer.";
  }

  if (!productType || !VALID_CATEGORIES.has(productType)) {
    fieldErrors.productType = "Please select a valid category.";
  }

  if (!productGenderUse || !VALID_GENDERS.has(productGenderUse)) {
    fieldErrors.productGenderUse = "Please select a valid target gender.";
  }

  const parsedPrice = Number(rawPrice);
  if (!rawPrice || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
    fieldErrors.productPrice = "Enter a valid price greater than 0.";
  }

  const parsedQuantity = Number(rawQuantity);
  if (!rawQuantity || !Number.isInteger(parsedQuantity) || parsedQuantity < 0) {
    fieldErrors.productQuantity = "Enter a whole stock quantity (0 or more).";
  }

  // Thumbnail is required ONLY if there is no retained existing thumbnail
  if (!newThumbnail && !hasExistingThumbnail) {
    fieldErrors.media = "Main product thumbnail is required.";
  } else if (newThumbnail && !newThumbnail.type.startsWith("image/")) {
    fieldErrors.media = "Main thumbnail must be a valid image file.";
  } else if (newThumbnail && newThumbnail.size > MAX_IMAGE_BYTES) {
    fieldErrors.media = "Main thumbnail must be under 5MB.";
  } else if (galleryFiles.length > MAX_GALLERY_IMAGES) {
    fieldErrors.media = `You can upload at most ${MAX_GALLERY_IMAGES} new gallery photos.`;
  } else if (
    galleryFiles.some(
      (f) => !f.type.startsWith("image/") || f.size > MAX_IMAGE_BYTES,
    )
  ) {
    fieldErrors.media = "All gallery photos must be images under 5MB each.";
  } else if (videoFiles.length > MAX_VIDEOS) {
    fieldErrors.media = `You can upload at most ${MAX_VIDEOS} new product videos.`;
  } else if (
    videoFiles.some(
      (f) => !f.type.startsWith("video/") || f.size > MAX_VIDEO_BYTES,
    )
  ) {
    fieldErrors.media =
      "All product videos must be valid video files under 50MB.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    showAlert({
      variant: "caution",
      message: "Please fix the highlighted fields before saving changes.",
    });
    return { success: false, fieldErrors };
  }

  const payload = new FormData();
  payload.append(PRODUCT_FORM_FIELDS.productBrand, productBrand);
  payload.append(PRODUCT_FORM_FIELDS.productName, productName);
  payload.append(PRODUCT_FORM_FIELDS.productType, productType);
  payload.append(PRODUCT_FORM_FIELDS.productGenderUse, productGenderUse);
  payload.append(PRODUCT_FORM_FIELDS.productPrice, parsedPrice.toFixed(2));
  payload.append(PRODUCT_FORM_FIELDS.productQuantity, String(parsedQuantity));
  payload.append(PRODUCT_FORM_FIELDS.productDescription, productDescription);

  if (removedMediaIds) {
    payload.append("removedMediaIds", removedMediaIds);
  }

  if (newThumbnail) {
    payload.append(PRODUCT_FORM_FIELDS.thumbnail, newThumbnail);
  }

  galleryFiles.forEach((file) => {
    payload.append(PRODUCT_FORM_FIELDS.galleryImages, file);
  });

  videoFiles.forEach((file) => {
    payload.append(PRODUCT_FORM_FIELDS.videos, file);
  });

  try {
    const response = await api.patch<{ success: boolean; message?: string }>(
      `/admin/products/${encodeURIComponent(productId)}`,
      payload,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60_000,
        skipGlobalErrorAlert: true,
      },
    );
    const successMessage =
      response.data?.message || `"${productName}" updated successfully!`;

    showAlert({
      variant: "success",
      message: successMessage,
    });

    return {
      success: true,
      message: successMessage,
      submittedAt: Date.now(),
    };
  } catch (error) {
    let errorMessage = "Failed to update product. Please try again.";

    if (
      isAxiosError<{
        message?: string;
        fieldErrors?: ProductActionData["fieldErrors"];
      }>(error)
    ) {
      if (!error.response) {
        errorMessage =
          "Cannot reach the server. Check your connection or backend status.";
      } else if (error.code === "ECONNABORTED") {
        errorMessage =
          "Upload timed out. Check your connection or try smaller media files.";
      } else if (error.response.status === 413) {
        errorMessage = "Uploaded files exceed the server size limit.";
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }

      if (error.response?.data?.fieldErrors) {
        showAlert({ variant: "error", message: errorMessage });
        return {
          success: false,
          error: errorMessage,
          fieldErrors: error.response.data.fieldErrors,
        };
      }
    }

    showAlert({ variant: "error", message: errorMessage });
    return {
      success: false,
      error: errorMessage,
    };
  }
};
