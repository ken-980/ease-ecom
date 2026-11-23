// src/components/admin/inventory/EditProductSkeleton.tsx
export const EditProductSkeleton = () => {
  return (
    <div
      aria-busy="true"
      aria-label="Loading product editor"
      className="h-full flex flex-col gap-4 overflow-hidden animate-pulse"
    >
      {/* Header bar skeleton */}
      <div className="flex items-center justify-between shrink-0">
        <div className="space-y-1.5">
          <div className="h-5 w-44 rounded-sm bg-gray-200" />
          <div className="h-3 w-64 rounded-sm bg-gray-100" />
        </div>
        <div className="h-9 w-32 rounded-sm bg-gray-200" />
      </div>

      {/* Main 2-column form skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Left column: Inputs + RichTextEditor */}
        <div className="lg:col-span-7 rounded-sm border border-gray-200 bg-white p-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 rounded-sm bg-gray-100" />
            <div className="h-10 rounded-sm bg-gray-100" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 rounded-sm bg-gray-100" />
            <div className="h-10 rounded-sm bg-gray-100" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 rounded-sm bg-gray-100" />
            <div className="h-10 rounded-sm bg-gray-100" />
          </div>
          <div className="flex-1 min-h-36 rounded-sm bg-gray-100" />
        </div>

        {/* Right column: Thumbnail, Gallery, Videos */}
        <div className="lg:col-span-5 rounded-sm border border-gray-200 bg-white p-4 flex flex-col gap-4">
          <div className="h-36 rounded-sm bg-gray-100" />
          <div className="h-28 rounded-sm bg-gray-100" />
          <div className="h-24 rounded-sm bg-gray-100" />
        </div>
      </div>
    </div>
  );
};