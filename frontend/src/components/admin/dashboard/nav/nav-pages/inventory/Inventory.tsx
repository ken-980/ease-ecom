import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '../../../../../../utils/cn';

const getTabClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    'pb-2 text-sm font-medium border-b-2 transition ',
    isActive
      ? 'border-brand text-brand'
      : 'border-transparent text-ink-muted hover:text-ink-primary hover:border-brand-border'
  );

export const Inventory = () => {
  return (
    <section className="px-6 py-4 mt-3 font-poppins">
      <nav
        aria-label="Inventory navigation"
        className="flex items-center space-x-6 border-b border-brand-border mb-6"
      >
        <NavLink to="." end className={getTabClassName}>
          Home
        </NavLink>

        <NavLink to="add-product" className={getTabClassName}>
          Add Product
        </NavLink>


        <NavLink to={`edit-product/:productId`} className={getTabClassName}>
            Edit Product
        </NavLink>

        <NavLink to={`product-info`} className={getTabClassName}>
          Product Information
        </NavLink>
      </nav>

      <div>
        <Outlet />
      </div>
    </section>
  );
};