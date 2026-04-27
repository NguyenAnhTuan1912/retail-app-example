import { BrowserRouter } from 'react-router-dom';
import { useAppRoutes } from './hooks/useAppRoutes';

function AppRoutes() {
  return useAppRoutes();
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
