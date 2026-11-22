// src/components/admin/inventory/RecentProductsTable.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { MoreVertical, Eye, Pencil, Trash2 } from 'lucide-react';
import { TablePagination } from '../../../../../ui/TablePagination';


export interface InventoryProductRow {
  id: number | string;
  thumbnailUrl?: string | null;
  productBrand: string;
  productName: string;
  productType: string;
  productQuantity: number;
  productPrice: number | string;
  createdAt: string; // ISO timestamp
}

export interface RecentProductsTableProps {
  products: InventoryProductRow[];
  pageSize?: number;
  title?: string;
  onView?: (product: InventoryProductRow) => void;
  onEdit?: (product: InventoryProductRow) => void;
  onDelete?: (product: InventoryProductRow) => void;
}

const formatCreatedDateTime = (isoDate: string) => {
  const dateObj = new Date(isoDate);
  if (Number.isNaN(dateObj.getTime())) {
    return { date: '—', time: '' };
  }

  const date = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  const time = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return { date, time };
};

export const RecentProductsTable = ({
  products,
  pageSize = 5,
  title = 'Recently Added Products',
  onView,
  onEdit,
  onDelete,
}: RecentProductsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);

  // Cap at 20 items max as specified, then paginate by 5
  const cappedProducts = useMemo(() => products.slice(0, 20), [products]);
  const totalPages = Math.max(1, Math.ceil(cappedProducts.length / pageSize));

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return cappedProducts.slice(start, start + pageSize);
  }, [cappedProducts, safeCurrentPage, pageSize]);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    if (openMenuId === null) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(e.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenuId(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openMenuId]);

  const handlePageChange = (page: number) => {
    setOpenMenuId(null);
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 rounded-sm border border-gray-200 bg-white shadow-2xs font-plus-font overflow-hidden">
      {/* Compact Header Bar */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          <span className="rounded-sm bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
            Last {cappedProducts.length}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          Page {safeCurrentPage} of {totalPages}
        </span>
      </div>

      {/* Table Wrapper */}
      <div className="flex-1 min-h-0 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              <th className="py-2.5 pl-4 pr-2 w-16">Image</th>
              <th className="px-3 py-2.5">Name</th>
              <th className="px-3 py-2.5">Category</th>
              <th className="px-3 py-2.5">Stock</th>
              <th className="px-3 py-2.5">Price</th>
              <th className="px-3 py-2.5">Created</th>
              <th className="py-2.5 pl-2 pr-4 text-right w-14">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-xs">
            {paginatedProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center text-sm text-gray-500"
                >
                  No products found in inventory.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product, index) => {
                const { date, time } = formatCreatedDateTime(product.createdAt);
                const numericPrice = Number(product.productPrice);
                const isMenuOpen = openMenuId === product.id;
                // Open upward on bottom 2 rows so menu never overflows container
                const openUpward = index >= paginatedProducts.length - 2 && paginatedProducts.length > 2;

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {/* 1. Image */}
                    <td className="py-2 pl-4 pr-2">
                      {product.thumbnailUrl ? (
                        <img
                          src={product.thumbnailUrl}
                          alt={product.productName}
                          className="h-9 w-9 rounded-sm border border-gray-200 object-cover bg-gray-50"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-gray-200 bg-gray-100 text-xs font-semibold text-gray-500">
                          {product.productBrand.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>

                    {/* 2. Name (Brand on top, truncated Product Name below) */}
                    <td className="px-3 py-2 max-w-[220px]">
                      <p className="font-semibold text-gray-900 truncate">
                        {product.productBrand}
                      </p>
                      <p
                        title={product.productName}
                        className="text-xs text-gray-500 truncate"
                      >
                        {product.productName}
                      </p>
                    </td>

                    {/* 3. Category */}
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className="inline-block rounded-sm border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-700">
                        {product.productType}
                      </span>
                    </td>

                    {/* 4. Stock */}
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-semibold ${
                          product.productQuantity === 0
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : product.productQuantity < 8
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {product.productQuantity === 0
                          ? 'Out of stock'
                          : `${product.productQuantity} in stock`}
                      </span>
                    </td>

                    {/* 5. Price */}
                    <td className="px-3 py-2 whitespace-nowrap font-semibold text-gray-900">
                      GHC{' '}
                      {Number.isNaN(numericPrice)
                        ? product.productPrice
                        : numericPrice.toLocaleString('en-GH', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                    </td>

                    {/* 6. Created (Date on top, Time below) */}
                    <td className="px-3 py-2 whitespace-nowrap">
                      <p className="font-medium text-gray-800">{date}</p>
                      <p className="text-[11px] text-gray-400">{time}</p>
                    </td>

                    {/* 7. Action (Three dots dropdown) */}
                    <td className="py-2 pl-2 pr-4 text-right">
                      <div
                        ref={isMenuOpen ? menuContainerRef : null}
                        className="relative inline-block text-left"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(isMenuOpen ? null : product.id)
                          }
                          aria-label={`Actions for ${product.productName}`}
                          aria-expanded={isMenuOpen}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {isMenuOpen && (
                          <div
                            role="menu"
                            className={`absolute right-0 z-30 w-32 rounded-sm border border-gray-200 bg-white py-1 shadow-md ${
                              openUpward ? 'bottom-full mb-1' : 'top-full mt-1'
                            }`}
                          >
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setOpenMenuId(null);
                                onView?.(product);
                              }}
                              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-gray-500" />
                              <span>View</span>
                            </button>

                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setOpenMenuId(null);
                                onEdit?.(product);
                              }}
                              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5 text-gray-500" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setOpenMenuId(null);
                                onDelete?.(product);
                              }}
                              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <TablePagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};