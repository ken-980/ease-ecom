// src/components/ui/TablePagination.tsx
import { ArrowLeft, ArrowRight } from 'lucide-react';

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const formatPageNumber = (page: number): string =>
  page < 10 ? `0${page}` : `${page}`;

const getPageNumbers = (
  currentPage: number,
  totalPages: number
): Array<number | '...'> => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: TablePaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-2.5 font-plus-font shrink-0">
      {/* Left: Previous Button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-2 rounded-sm border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5 text-gray-500" />
        <span>Previous</span>
      </button>

      {/* Center: Zero-padded Page Numbers */}
      <nav aria-label="Pagination" className="flex items-center gap-1">
        {pages.map((item, idx) =>
          item === '...' ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 py-1 text-xs font-medium text-gray-400 select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={currentPage === item ? 'page' : undefined}
              className={`min-w-8 rounded-sm px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                currentPage === item
                  ? 'border border-gray-200 bg-gray-100/90 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {formatPageNumber(item)}
            </button>
          )
        )}
      </nav>

      {/* Right: Next Button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-2 rounded-sm border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
      >
        <span>Next</span>
        <ArrowRight className="h-3.5 w-3.5 text-gray-500" />
      </button>
    </div>
  );
};