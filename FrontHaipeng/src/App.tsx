import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminSliders from './pages/Admin/AdminSliders';
import AdminTelegram from './pages/Admin/AdminTelegram';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import CrmDashboard from './pages/Admin/CrmDashboard';
import CrmProduction from './pages/Admin/CrmProduction';
import CrmMotos from './pages/Admin/CrmMotos';
import CrmWorkers from './pages/Admin/CrmWorkers';
import CrmInventory from './pages/Admin/CrmInventory';
import CrmShops from './pages/Admin/CrmShops';
import CrmShopProfile from './pages/Admin/CrmShopProfile';
import CrmFinance from './pages/Admin/CrmFinance';
import CrmTransactions from './pages/Admin/CrmTransactions';
import CrmSales from './pages/Admin/CrmSales';
import CrmAnalytics from './pages/Admin/CrmAnalytics';
import CrmSettings from './pages/Admin/CrmSettings';
import CrmWorkerProfile from './pages/Admin/CrmWorkerProfile';
import CrmTransactionDetail from './pages/Admin/CrmTransactionDetail';
import CrmTransactionAdd from './pages/Admin/CrmTransactionAdd';
import { useThemeStore } from './store/themeStore';

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Main Store Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Admin Redirect */}
        <Route path="/admin" element={<Navigate to="/panel" replace />} />
        <Route path="/admin/*" element={<Navigate to="/panel" replace />} />

        {/* Admin Routes */}
        <Route path="/panel/login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/panel" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="sliders" element={<AdminSliders />} />
            <Route path="settings" element={<AdminTelegram />} />

            {/* CRM Routes */}
            <Route path="crm" element={<CrmDashboard />} />
            <Route path="crm/production" element={<CrmProduction />} />
            <Route path="crm/motos" element={<CrmMotos />} />
            <Route path="crm/workers" element={<CrmWorkers />} />
            <Route path="crm/workers/:id" element={<CrmWorkerProfile />} />
            <Route path="crm/inventory" element={<CrmInventory />} />
            <Route path="crm/shops" element={<CrmShops />} />
            <Route path="crm/shops/:id" element={<CrmShopProfile />} />
            <Route path="crm/finance" element={<CrmFinance />} />
            <Route path="crm/finance/new" element={<CrmTransactionAdd />} />
            <Route path="crm/finance/:id" element={<CrmTransactionDetail />} />
            <Route path="crm/transactions" element={<CrmTransactions />} />
            <Route path="crm/sales" element={<CrmSales />} />
            <Route path="crm/analytics" element={<CrmAnalytics />} />
            <Route path="crm/settings" element={<CrmSettings />} />

            <Route path="*" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const theme = useThemeStore((s) => s.theme);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/panel') || location.pathname.startsWith('/admin');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      {!isAdmin && <CartDrawer />}
      <AppRoutes />
      {!isAdmin && <Footer />}
    </>
  );
}

