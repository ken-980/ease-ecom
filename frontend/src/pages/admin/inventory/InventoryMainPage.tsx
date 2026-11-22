// src/pages/admin/inventory/InventorMainPage.tsx
import { useEffect } from 'react';
import {
  useNavigate,
  useNavigation,
  useRevalidator,
  useLoaderData
} from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { StatsCard } from '../../../components/ui/StatsCard';
import { RecentProductsTable, type InventoryProductRow } from '../../../components/admin/dashboard/nav/nav-pages/inventory/RecentProductTable';
import { InventoryOverviewSkeleton } from '../../../components/admin/dashboard/nav/nav-pages/inventory/InventoryOverviewSkeleton';
import { showAlert } from '../../../lib/alert-store';
import type {
  InventoryStatsDTO,
  InventorySummaryItemDTO,
} from '../../../types/inventory';

export interface InventoryMainLoaderData {
  stats: InventoryStatsDTO;
  recentProducts: InventorySummaryItemDTO[];
  error?: string;
}



export const InventoryMainPage = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const revalidator = useRevalidator();
  
  const {stats, recentProducts, error: loaderError} = useLoaderData() as InventoryMainLoaderData


  // Show global bottom-right alert if loader reported an error
  useEffect(() => {
    if (loaderError) {
      showAlert({
        variant: 'error',
        message: loaderError,
      });
    }
  }, [loaderError]);

  // Display skeleton while navigating into this route or revalidating data
  const isRouteLoading =
    navigation.state === 'loading' &&
    navigation.location?.pathname.endsWith('/inventory');

  if (isRouteLoading || revalidator.state === 'loading') {
    return <InventoryOverviewSkeleton />;
  }

  const {
    totalProducts,
    outOfStockCount,
    totalStockValuation,
    activeBrandsCount,
  } = stats;

  const isCriticalStockAlert = outOfStockCount < 8;

  const handleViewProduct = (product: InventoryProductRow) => {
    navigate(`product/${product.id}`);
  };

  const handleEditProduct = (product: InventoryProductRow) => {
    navigate(`edit-product/${product.id}`);
  };

  const handleDeleteProduct = (product: InventoryProductRow) => {
    showAlert({
      variant: 'caution',
      message: `Delete requested for "${product.productName}".`,
    });
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Inline Retry Strip if loader failed */}
      {loaderError && (
        <div className="flex items-center justify-between rounded-sm border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs text-rose-800 shrink-0">
          <span>{loaderError}</span>
          <button
            type="button"
            onClick={() => revalidator.revalidate()}
            className="inline-flex items-center gap-1.5 rounded-sm border border-rose-300 bg-white px-2.5 py-1 font-medium text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Four Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <StatsCard
          title="Total Inventory Volume"
          value={totalProducts}
          unit={totalProducts === 1 ? 'Product' : 'Products'}
          subtitle="Active fragrances in catalog"
          linkText="View all"
          linkTo="all"
          variant="green"
          className="rounded-sm"
        />

        <StatsCard
          title="Out of Stock"
          value={outOfStockCount}
          unit={outOfStockCount === 1 ? 'Product' : 'Products'}
          subtitle="Requires immediate restock"
          linkText="Restock items"
          linkTo="out-of-stock"
          variant="rose"
          valueClassName={
            isCriticalStockAlert ? 'text-red-600' : 'text-gray-900'
          }
          className="rounded-sm"
        />

        <StatsCard
          title="Inventory Valuation"
          value={`GHC ${totalStockValuation.toLocaleString('en-GH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          subtitle="Total retail value on hand"
          variant="amber"
          className="rounded-sm"
        />

        <StatsCard
          title="Fragrance Houses"
          value={activeBrandsCount}
          unit="Brands"
          subtitle="Distinct luxury labels"
          linkText="Manage brands"
          linkTo="brands"
          variant="blue"
          className="rounded-sm"
        />
      </div>

      {/* Recently Added Products Table (Paginated by 5, capped at 20) */}
      <RecentProductsTable
        products={recentProducts}
        pageSize={5}
        onView={handleViewProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};