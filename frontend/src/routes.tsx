import { createBrowserRouter } from "react-router-dom";
import SignInForm from './components/auth/sign-in-form/SignInForm';
import RootLayout from "./root-layout";
import ShopHome from "./components/shop-components/ShopIndex";
import AdminAuth from "./components/admin/auth/SignIn";
import AdminRegister from "./components/admin/auth/Register";
import { adminRegisterAction } from './actions/admin/admin-register-action';
import { signInAction } from "./actions/admin/sigin-action";
import DashboardHome from "./components/admin/dashboard/MainDashBoard";
import { adminHomeLoaderFunction } from './loaders/admin/admin-home-loader';
import { adminAction } from "./actions/admin/dashboard-action";
import { ErrorPage } from "./components/ErrorPage";
import { DashBoardPage } from "./components/admin/dashboard/nav/nav-pages/DashboardPage";
import { TaskPage } from "./components/admin/dashboard/nav/nav-pages/TaskPage";
import { Inventory } from "./components/admin/dashboard/nav/nav-pages/inventory/Inventory";
import { inventoryPageLoader } from "./loaders/admin/inventory-page-loader";
import { InventoryActionFuncion } from "./actions/admin/inventory-action";
import { EditProduct } from "./components/admin/dashboard/nav/nav-pages/inventory/edit-product-page";
import { eidtProductAction } from "./actions/admin/edit-product-action";
import { editProdcutPageLoader } from "./loaders/admin/edit-product-loader";
import { adminViewDataLoaderFunction } from "./loaders/admin/main-dashboard-view-loader";
import { shopHomeLoader } from "./loaders/shop/shop-home-page-loader";
import { ProductsCartCheck } from "./components/shop-components/cart/product-check";


export const routes = createBrowserRouter([
    {
        element : <RootLayout />,
        errorElement : <ErrorPage />,
        children :[
            {
                path : "/sign-in",
                element : <SignInForm /> 
            },
            {
                
                path : "/",
                element : <ShopHome />,
                loader : shopHomeLoader
            },
            {
                path : "/admin",
                element : <AdminAuth />,
                action : signInAction,
            },
            {
                path : "/admin/register",
                element : <AdminRegister />,
                action : adminRegisterAction
            },
            {
                //create a dynamic route here for user
                path : "/order/:userId",
                element : <ProductsCartCheck />
            },
            {
                path : "/admin/:adminId/",
                element : <DashboardHome />,
                loader : adminHomeLoaderFunction,
                action : adminAction,
                errorElement : <ErrorPage />,

                children : [
                    {
                        path : "/admin/:adminId/dashboard",
                        element : <DashBoardPage />,
                        loader : adminViewDataLoaderFunction
                    },
                    {
                        path : "/admin/:adminId/inventory",
                        element : <Inventory />,
                        loader : inventoryPageLoader,
                        action : InventoryActionFuncion
                        
                    },
                    {
                        path : "/admin/:adminId/customers",
                        element : <TaskPage />
                    },

                    {
                        path : "/admin/:adminId/orders",
                        element : <TaskPage />
                    },
                    {
                        path : "/admin/:adminId/edit/:productId",
                        element : <EditProduct />,
                        action : eidtProductAction,
                        loader : editProdcutPageLoader 
                    }
                    
                ]
            }


        ]
    }
])  