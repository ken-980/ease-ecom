// src/components/admin/inventory/InventoryOverviewSkeleton.tsx
export const InventoryOverviewSkeleton = () => {
  return (
    <div
      aria-busy="true"
      aria-label="Loading inventory overview"
      className="h-full flex flex-col gap-4 overflow-hidden animate-pulse"
    >
      {/* 4 Stat Card Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-34 rounded-sm border border-gray-200 bg-white p-4 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="h-3 w-28 rounded-sm bg-gray-200" />
              <div className="h-8 w-24 rounded-sm bg-gray-200" />
              <div className="h-2.5 w-36 rounded-sm bg-gray-100" />
            </div>
            <div className="h-3 w-16 rounded-sm bg-gray-100" />
          </div>
        ))}
      </div>

      {/* Table Skeleton (5 rows) */}
      <div className="flex flex-col flex-1 min-h-0 rounded-sm border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="h-4 w-44 rounded-sm bg-gray-200" />
          <div className="h-3 w-20 rounded-sm bg-gray-100" />
        </div>

        <div className="flex-1 divide-y divide-gray-100 px-4">
          {Array.from({ length: 5 }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="flex items-center justify-between py-3 gap-4"
            >
              <div className="h-9 w-9 rounded-sm bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-32 rounded-sm bg-gray-200" />
                <div className="h-2.5 w-48 rounded-sm bg-gray-100" />
              </div>
              <div className="h-5 w-24 rounded-sm bg-gray-100 hidden sm:block" />
              <div className="h-5 w-20 rounded-sm bg-gray-100" />
              <div className="h-3.5 w-24 rounded-sm bg-gray-200" />
              <div className="space-y-1 hidden md:block">
                <div className="h-3 w-20 rounded-sm bg-gray-200" />
                <div className="h-2.5 w-14 rounded-sm bg-gray-100" />
              </div>
              <div className="h-6 w-6 rounded-sm bg-gray-100" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-2.5">
          <div className="h-7 w-24 rounded-sm bg-gray-100" />
          <div className="h-7 w-40 rounded-sm bg-gray-100" />
          <div className="h-7 w-20 rounded-sm bg-gray-100" />
        </div>
      </div>
    </div>
  );
};