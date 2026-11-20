import { Form, useActionData, useNavigation } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { FormInput } from '../../../components/ui/FormInput';
import { FormSelect } from '../../../components/ui/FormSelect';
import { RichTextEditor } from '../../../components/ui/RichTextEditor';
import { PRODUCT_CATEGORIES } from '../../../constants/productCategories';
import { TARGET_GENDERS } from '../../../constants/productOptions';
import { PRODUCT_FORM_FIELDS } from '../../../constants/productFields';
import { ProductMediaUploader } from './ProductMediaUploader';

export interface ProductActionData {
  error?: string;
  fieldErrors?: Partial<Record<keyof typeof PRODUCT_FORM_FIELDS | 'media', string>>;
}

export const AddProductPage = () => {
  const actionData = useActionData() as ProductActionData | undefined;
  const navigation = useNavigation();

  const isBusy = navigation.state !== 'idle';

  return (
    <Form
      method="post"
      encType="multipart/form-data"
      className="h-full lg:h-[calc(100vh-8.5rem)] grid grid-cols-1 lg:grid-cols-3 gap-5 font-poppins"
    >
      {/* Left Column (2/3 width): Basic Product Info */}
      <div className="lg:col-span-2 h-full flex flex-col">
        <Card className="p-5 flex-1 flex flex-col">
          <h2 className="text-lg font-alt-font font-semibold tracking-wide text-brand mb-4 shrink-0">
            Basic Information
          </h2>

          {actionData?.error && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-4 rounded-md border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-medium text-red-700 shrink-0"
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
                required
                disabled={isBusy}
                placeholder="e.g., Dior"
                error={actionData?.fieldErrors?.productBrand}
              />

              <FormInput
                label="Product Name"
                name={PRODUCT_FORM_FIELDS.productName}
                type="text"
                required
                disabled={isBusy}
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
                defaultValue=""
                required
                disabled={isBusy}
                error={actionData?.fieldErrors?.productType}
              />

              <FormSelect
                label="Gender"
                name={PRODUCT_FORM_FIELDS.productGenderUse}
                placeholder="Select gender"
                options={TARGET_GENDERS}
                defaultValue=""
                required
                disabled={isBusy}
                error={actionData?.fieldErrors?.productGenderUse}
              />

              <FormInput
                label="Price (GHC)"
                name={PRODUCT_FORM_FIELDS.productPrice}
                type="number"
                min="0"
                step="0.01"
                required
                disabled={isBusy}
                placeholder="240.00"
                error={actionData?.fieldErrors?.productPrice}
              />

              <FormInput
                label="Stock Quantity"
                name={PRODUCT_FORM_FIELDS.productQuantity}
                type="number"
                min="0"
                step="1"
                required
                disabled={isBusy}
                placeholder="e.g., 25"
                error={actionData?.fieldErrors?.productQuantity}
              />
            </div>

            {/* Row 3: Rich Text Description fills remaining height */}
            <RichTextEditor
              label="Description"
              name={PRODUCT_FORM_FIELDS.productDescription}
              disabled={isBusy}
              error={actionData?.fieldErrors?.productDescription}
              className="flex-1 min-h-0"
            />
          </div>
        </Card>
      </div>

      {/* Right Column (1/3 width): Compact Media Library & Submit */}
      <div className="lg:col-span-1 h-full flex flex-col">
        <Card className="p-5 flex-1 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <h2 className="text-lg font-alt-font font-semibold tracking-wide text-brand">
              Product Media Library
            </h2>

            <ProductMediaUploader
              disabled={isBusy}
              error={actionData?.fieldErrors?.media}
            />
          </div>

          <div className="pt-4 mt-4 border-t border-brand-border shrink-0">
            <Button type="submit" fullWidth isLoading={isBusy}>
              Publish Product
            </Button>
          </div>
        </Card>
      </div>
    </Form>
  );
};