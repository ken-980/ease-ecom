// src/pages/admin/inventory/EditProductPage.tsx
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
  useRevalidator,
} from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { FormInput } from '../../../components/ui/FormInput';
import { FormSelect } from '../../../components/ui/FormSelect';
import { RichTextEditor } from '../../../components/ui/RichTextEditor';
import { EditProductSkeleton } from '../../../components/admin/inventory/EditProductSkeleton';
import { PRODUCT_CATEGORIES } from '../../../constants/productCategories';
import { TARGET_GENDERS } from '../../../constants/productOptions';
import { PRODUCT_FORM_FIELDS } from '../../../constants/productFields';
import { ProductMediaUploader } from './ProductMediaUploader';
import type { ProductActionData } from './AddProductPage';
import type { EditProductLoaderData } from '../../../loaders/admin/edit-product-loader';

export const EditProductPage = () => {
  const { product, error: loaderError } =
    useLoaderData() as EditProductLoaderData;
  const actionData = useActionData() as ProductActionData | undefined;
  const navigation = useNavigation();
  const revalidator = useRevalidator();

  const isSubmitting = navigation.state === 'submitting';
  const isRouteLoading =
    navigation.state === 'loading' &&
    navigation.location?.pathname.includes('/edit-product/');

  if (isRouteLoading) {
    return <EditProductSkeleton />;
  }

  // Graceful fallback if product failed to load or does not exist
  if (!product) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 rounded-sm border border-gray-200 bg-white p-8 text-center font-poppins">
        <p className="text-sm font-medium text-gray-800">
          {loaderError || 'Unable to load product details.'}
        </p>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/admin/inventory"
            relative="path"
            className="inline-flex items-center gap-1.5 rounded-sm border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Inventory
          </Link>
          <button
            type="button"
            onClick={() => revalidator.revalidate()}
            className="inline-flex items-center gap-1.5 rounded-sm bg-brand px-3.5 py-2 text-xs font-medium text-white hover:opacity-95 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const uploaderKey = `${product.id}-${actionData?.submittedAt ?? 'initial'}`;

  return (
    <Form
      key={uploaderKey}
      method="patch"
      encType="multipart/form-data"
      className="h-full lg:h-[calc(100vh-8.5rem)] grid grid-cols-1 lg:grid-cols-3 gap-5 font-poppins"
    >
      {/* Left Column (2/3 width): Basic Product Info */}
      <div className="lg:col-span-2 h-full flex flex-col">
        <Card className="p-5 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-lg font-alt-font font-semibold tracking-wide text-brand">
              Edit Product Details
            </h2>
            <Link
              to="../.."
              relative="path"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Inventory
            </Link>
          </div>

          {actionData?.success && actionData.message && (
            <div
              role="status"
              aria-live="polite"
              className="mb-4 rounded-sm border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-medium text-emerald-700 shrink-0"
            >
              {actionData.message}
            </div>
          )}

          {actionData?.error && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-4 rounded-sm border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-medium text-red-700 shrink-0"
            >
              {actionData.error}
            </div>
          )}

          <div className="flex-1 flex flex-col gap-4">
            {/* Row 1: Brand & Product Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
              <FormInput
                label="Brand Name"
                name={PRODUCT_FORM_FIELDS.productBrand}
                type="text"
                defaultValue={product.productBrand}
                required
                disabled={isSubmitting}
                placeholder="e.g., Dior"
                error={actionData?.fieldErrors?.productBrand}
              />

              <FormInput
                label="Product Name"
                name={PRODUCT_FORM_FIELDS.productName}
                type="text"
                defaultValue={product.productName}
                required
                disabled={isSubmitting}
                placeholder="e.g., Sauvage Elixir"
                error={actionData?.fieldErrors?.productName}
              />
            </div>

            {/* Row 2: Category, Gender, Price & Stock Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
              <FormSelect
                label="Category"
                name={PRODUCT_FORM_FIELDS.productType}
                placeholder="Select category"
                options={PRODUCT_CATEGORIES}
                defaultValue={product.productType}
                required
                disabled={isSubmitting}
                error={actionData?.fieldErrors?.productType}
              />

              <FormSelect
                label="Gender"
                name={PRODUCT_FORM_FIELDS.productGenderUse}
                placeholder="Select gender"
                options={TARGET_GENDERS}
                defaultValue={product.productGenderUse}
                required
                disabled={isSubmitting}
                error={actionData?.fieldErrors?.productGenderUse}
              />

              <FormInput
                label="Price (GHC)"
                name={PRODUCT_FORM_FIELDS.productPrice}
                type="number"
                min="0"
                step="0.01"
                defaultValue={product.productPrice.toFixed(2)}
                required
                disabled={isSubmitting}
                placeholder="240.00"
                error={actionData?.fieldErrors?.productPrice}
              />

              <FormInput
                label="Stock Quantity"
                name={PRODUCT_FORM_FIELDS.productQuantity}
                type="number"
                min="0"
                step="1"
                defaultValue={product.productQuantity}
                required
                disabled={isSubmitting}
                placeholder="e.g., 25"
                error={actionData?.fieldErrors?.productQuantity}
              />
            </div>

            {/* Row 3: Rich Text Description */}
            <RichTextEditor
              label="Description"
              name={PRODUCT_FORM_FIELDS.productDescription}
              defaultValue={product.productDescription ?? ''}
              disabled={isSubmitting}
              error={actionData?.fieldErrors?.productDescription}
              className="flex-1 min-h-0"
            />
          </div>
        </Card>
      </div>

      {/* Right Column (1/3 width): Existing + New Media Library & Save */}
      <div className="lg:col-span-1 h-full flex flex-col">
        <Card className="p-5 flex-1 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <h2 className="text-lg font-alt-font font-semibold tracking-wide text-brand">
              Product Media Library
            </h2>

            <ProductMediaUploader
              disabled={isSubmitting}
              error={actionData?.fieldErrors?.media}
              existingMedia={product.media}
            />
          </div>

          <div className="pt-4 mt-4 border-t border-brand-border shrink-0">
            <Button type="submit" fullWidth isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </Form>
  );
};