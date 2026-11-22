import { useNavigate } from 'react-router-dom';
import { StatsCard } from '../../../components/ui/StatsCard';
import { RecentProductsTable, type InventoryProductRow } from '../../../components/admin/dashboard/nav/nav-pages/inventory/RecentProductTable';
import { MOCK_RECENT_PRODUCTS } from '../../../data/mockRecentProduct';
import { showAlert } from '../../../lib/alert-store';

export const InventorMainPage = () => {
  const navigate = useNavigate();

  const MOCK_INVENTORY_STATS = {
    totalProducts: 42,
    outOfStockCount: 6,
    totalStockValuation: 48650.0, // GHC
    activeBrandsCount: 14,
  };

  const {
    totalProducts,
    outOfStockCount,
    totalStockValuation,
    activeBrandsCount,
  } = MOCK_INVENTORY_STATS;

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
      message: `Delete requested for "${product.productName}" (wire up delete modal/action).`,
    });
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
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
        products={MOCK_RECENT_PRODUCTS}
        pageSize={5}
        onView={handleViewProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};