import { useRoutes } from 'react-router-dom';
import GlobalHeaderLayout from '../layouts/GlobalHeaderLayout';
import HomePage from '../pages/HomePage';
import ProductPage from '../pages/ProductPage';
import OrderPage from '../pages/OrderPage';
import CartPage from '../pages/CartPage';

export function useAppRoutes() {
  return useRoutes([
    {
      element: <GlobalHeaderLayout />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/products/:id', element: <ProductPage /> },
        { path: '/orders/:id', element: <OrderPage /> },
        { path: '/cart', element: <CartPage /> },
      ],
    },
  ]);
}
