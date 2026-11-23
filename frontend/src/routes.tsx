import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts & Error Boundaries
import RootLayout from './root-layout';
import DashboardHome from './components/admin/dashboard/MainDashBoard';
import { ErrorPage } from './components/ErrorPage';

// Storefront Pages & Loaders
import ShopHome from './components/shop-components/ShopIndex';
import SignInForm from './components/auth/sign-in-form/SignInForm';
import { ProductsCartCheck } from './components/shop-components/cart/product-check';
import { shopHomeLoader } from './loaders/shop/shop-home-loader';

// Admin Auth Pages & Actions
import { AdminLogin } from './components/admin/auth/AdminLogin';
import AdminRegister from './components/admin/auth/AdminRegister';
import { signInAction } from './actions/admin/sigin-action';
import { adminRegisterAction } from './actions/admin/admin-register-action';
import { addProductAction } from './actions/admin/add-product-action';

// Admin Dashboard Pages, Loaders & Actions
import { DashBoardPage } from './components/admin/dashboard/nav/nav-pages/DashboardPage';
import { Inventory } from './components/admin/dashboard/nav/nav-pages/inventory/Inventory';
import { AddProductPage } from './pages/admin/inventory/AddProductPage';
import { TaskPage } from './components/admin/dashboard/nav/nav-pages/TaskPage';

import { adminHomeLoaderFunction } from './loaders/admin/admin-home-loader';
import { adminViewDataLoaderFunction } from './loaders/admin/main-dashboard-view-loader';
import { inventoryPageLoader } from './loaders/admin/inventory-page-loader';


import { adminAction } from './actions/admin/dashboard-action';
import { EditProductPage } from './pages/admin/inventory/EditProductPage';
import { InventoryMainPage } from './pages/admin/inventory/InventoryMainPage';
import { InventoryOverviewSkeleton } from './components/admin/dashboard/nav/nav-pages/inventory/InventoryOverviewSkeleton';
import { inventoryMainLoader } from './loaders/admin/admin-inventory-main-loader';
import { editProductPageLoader } from './loaders/admin/edit-product-loader';
import { editProductPageActionFunction } from './actions/admin/edit-product-action';
import { EditProductSkeleton } from './components/admin/inventory/EditProductSkeleton';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <ShopHome />,
        loader: shopHomeLoader,
      },
      {
        path: 'sign-in',
        element: <SignInForm />,
      },
      {
        path: 'order/:userId',
        element: <ProductsCartCheck />,
      },
    ],
  },

  // Public Admin Auth Branch
  {
    path: '/admin',
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <AdminLogin />,
        action: signInAction,
      },
      {
        path: 'register',
        element: <AdminRegister />,
        action: adminRegisterAction,
      },
    ],
  },

  // Protected Admin Dashboard Branch (Guarded by adminHomeLoaderFunction)
  {
    path: '/admin/:adminId',
    element: <DashboardHome />,
    loader: adminHomeLoaderFunction,
    action: adminAction,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashBoardPage />,
        loader: adminViewDataLoaderFunction,
      },
    {
    path: 'inventory',
    element: <Inventory />,
    loader: inventoryPageLoader,
    children: [
        {
        index: true,
        // Renders main product table/list by default when visiting /admin/:adminId/inventory
        element: <InventoryMainPage />, 
        HydrateFallback: InventoryOverviewSkeleton,
        loader: inventoryMainLoader
        },
        {
        path: 'add-product',
        element: <AddProductPage />,
        action: addProductAction,
        },
        {
        path: 'edit-product/:productId',
        element: <EditProductPage />,
        loader: editProductPageLoader,
        action: editProductPageActionFunction,
        hydrateFallbackElement: <EditProductSkeleton />
        },
    ],
    },
 
      {
        path: 'customers',
        element: <TaskPage />,
      },
      {
        path: 'orders',
        element: <TaskPage />,
      },
    ],
  },

  // Catch-All 404 Route
  {
    path: '*',
    element: <ErrorPage />,
  },
]);