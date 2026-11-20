import { ActionFunction, redirect } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { api } from '../../lib/axios-api';
import { PRODUCT_CATEGORIES } from '../../constants/productCategories';
import { PRODUCT_FORM_FIELDS } from '../../constants/productFields';
import { TARGET_GENDERS } from '../../constants/productOptions';
import type { ProductActionData } from '../../pages/admin/inventory/AddProductPage';

interface CreateProductResponse {
  message?: string;
  product?: {
    id: number;
    productName: string;
  };
}

const VALID_CATEGORIES = new Set<string>(
  PRODUCT_CATEGORIES.map((c) => c.value)
);
const VALID_GENDERS = new Set<string>(TARGET_GENDERS.map((g) => g.value));

const MAX_GALLERY_IMAGES = 6;
const MAX_VIDEOS = 2;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50MB

const getTrimmedString = (formData: FormData, key: string): string => {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
};

const getNonEmptyFiles = (formData: FormData, key: string): File[] => {
  return formData
    .getAll(key)
    .filter(
      (entry): entry is File => entry instanceof File && entry.size > 0
    );
};

export const addProductAction: ActionFunction = async ({
  request,
  params,
}): Promise<ProductActionData | Response> => {
  const formData = await request.formData();

  // 1. Extract and narrow all form inputs safely
  const productBrand = getTrimmedString(
    formData,
    PRODUCT_FORM_FIELDS.productBrand
  );
  const productName = getTrimmedString(
    formData,
    PRODUCT_FORM_FIELDS.productName
  );
  const productType = getTrimmedString(
    formData,
    PRODUCT_FORM_FIELDS.productType
  );
  const productGenderUse = getTrimmedString(
    formData,
    PRODUCT_FORM_FIELDS.productGenderUse
  );
  const rawPrice = getTrimmedString(formData, PRODUCT_FORM_FIELDS.productPrice);
  const rawQuantity = getTrimmedString(
    formData,
    PRODUCT_FORM_FIELDS.productQuantity
  );
  const productDescription = getTrimmedString(
    formData,
    PRODUCT_FORM_FIELDS.productDescription
  );

  const thumbnailFiles = getNonEmptyFiles(
    formData,
    PRODUCT_FORM_FIELDS.thumbnail
  );
  const galleryFiles = getNonEmptyFiles(
    formData,
    PRODUCT_FORM_FIELDS.galleryImages
  );
  const videoFiles = getNonEmptyFiles(formData, PRODUCT_FORM_FIELDS.videos);

  // 2. Comprehensive client-side validation before uploading large media
  const fieldErrors: NonNullable<ProductActionData['fieldErrors']> = {};

  if (!productBrand) {
    fieldErrors.productBrand = 'Brand name is required.';
  } else if (productBrand.length > 100) {
    fieldErrors.productBrand = 'Brand name must be 100 characters or fewer.';
  }

  if (!productName) {
    fieldErrors.productName = 'Product name is required.';
  } else if (productName.length > 150) {
    fieldErrors.productName = 'Product name must be 150 characters or fewer.';
  }

  if (!productType || !VALID_CATEGORIES.has(productType)) {
    fieldErrors.productType = 'Please select a valid category.';
  }

  if (!productGenderUse || !VALID_GENDERS.has(productGenderUse)) {
    fieldErrors.productGenderUse = 'Please select a valid target gender.';
  }

  const parsedPrice = Number(rawPrice);
  if (!rawPrice || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
    fieldErrors.productPrice = 'Enter a valid price greater than 0.';
  }

  const parsedQuantity = Number(rawQuantity);
  if (
    !rawQuantity ||
    !Number.isInteger(parsedQuantity) ||
    parsedQuantity < 0
  ) {
    fieldErrors.productQuantity = 'Enter a whole stock quantity (0 or more).';
  }

  // Validate media files (thumbnail required; gallery & videos optional)
  const thumbnail = thumbnailFiles[0];
  if (!thumbnail) {
    fieldErrors.media = 'Main product thumbnail is required.';
  } else if (!thumbnail.type.startsWith('image/')) {
    fieldErrors.media = 'Main thumbnail must be a valid image file.';
  } else if (thumbnail.size > MAX_IMAGE_BYTES) {
    fieldErrors.media = 'Main thumbnail must be under 5MB.';
  } else if (galleryFiles.length > MAX_GALLERY_IMAGES) {
    fieldErrors.media = `You can upload at most ${MAX_GALLERY_IMAGES} gallery photos.`;
  } else if (
    galleryFiles.some(
      (f) => !f.type.startsWith('image/') || f.size > MAX_IMAGE_BYTES
    )
  ) {
    fieldErrors.media = 'All gallery photos must be images under 5MB each.';
  } else if (videoFiles.length > MAX_VIDEOS) {
    fieldErrors.media = `You can upload at most ${MAX_VIDEOS} product videos.`;
  } else if (
    videoFiles.some(
      (f) => !f.type.startsWith('video/') || f.size > MAX_VIDEO_BYTES
    )
  ) {
    fieldErrors.media = 'All product videos must be valid video files under 50MB.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  // 3. Construct clean multipart FormData payload with normalized values
  const payload = new FormData();
  payload.append(PRODUCT_FORM_FIELDS.productBrand, productBrand);
  payload.append(PRODUCT_FORM_FIELDS.productName, productName);
  payload.append(PRODUCT_FORM_FIELDS.productType, productType);
  payload.append(PRODUCT_FORM_FIELDS.productGenderUse, productGenderUse);
  payload.append(PRODUCT_FORM_FIELDS.productPrice, parsedPrice.toFixed(2));
  payload.append(
    PRODUCT_FORM_FIELDS.productQuantity,
    String(parsedQuantity)
  );

  if (productDescription) {
    payload.append(
      PRODUCT_FORM_FIELDS.productDescription,
      productDescription
    );
  }

  payload.append(PRODUCT_FORM_FIELDS.thumbnail, thumbnail);

  galleryFiles.forEach((file) => {
    payload.append(PRODUCT_FORM_FIELDS.galleryImages, file);
  });

  videoFiles.forEach((file) => {
    payload.append(PRODUCT_FORM_FIELDS.videos, file);
  });

  // 4. Submit multipart payload to Express + Multer endpoint
  try {
    // Adjust endpoint path if your Express router mounts this at /admin/products
    await api.post<CreateProductResponse>('/admin/products', payload, {
      headers: {
        // Override default 'application/json' so browser sets multipart boundary automatically
        'Content-Type': 'multipart/form-data',
      },
      // Large video uploads to Cloudinary can take longer than standard JSON requests
      timeout: 60_000,
    });

    // Redirect back to the parent inventory list (/admin/:adminId/inventory)
    if (params.adminId) {
      return redirect(
        `/admin/${encodeURIComponent(params.adminId)}/inventory`
      );
    }

    return redirect('..');
  } catch (error) {
    if (isAxiosError<{ message?: string; fieldErrors?: ProductActionData['fieldErrors'] }>(error)) {
      // Support structured fieldErrors if your Express validator returns them
      if (error.response?.data?.fieldErrors) {
        return {
          error: error.response.data.message,
          fieldErrors: error.response.data.fieldErrors,
        };
      }

      if (error.code === 'ECONNABORTED') {
        return {
          error:
            'Upload timed out. Check your connection or try smaller media files.',
        };
      }

      if (error.response?.status === 413) {
        return {
          fieldErrors: {
            media: 'Uploaded files exceed the server size limit.',
          },
        };
      }

      return {
        error:
          error.response?.data?.message ||
          'Failed to publish product. Please try again.',
      };
    }

    return {
      error: 'An unexpected error occurred while uploading the product.',
    };
  }
};