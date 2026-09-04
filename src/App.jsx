import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { useAdminAuth } from './context/AdminAuthContext';
import { ShieldCheck } from 'lucide-react';

// Layout Components
import SundaySaleBanner from './components/layout/SundaySaleBanner';
import AnnouncementBar from './components/layout/AnnouncementBar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingActions from './components/layout/FloatingActions';
import CartDrawer from './components/common/CartDrawer';
import Toast from './components/common/Toast';
import SplashScreen from './components/common/SplashScreen';

// Customer Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Categories from './pages/Categories';
import CategoryProducts from './pages/CategoryProducts';
import ProductDetails from './pages/ProductDetails';
import Offers from './pages/Offers';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import AccountSettings from './pages/AccountSettings';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Sale from './pages/Sale';
import SundaySale from './pages/SundaySale';
import Combos from './pages/Combos';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';

// Developer & Design Guides
import DesignTokensGuide from './pages/DesignTokensGuide';
import SkeletonGuide from './pages/SkeletonGuide';
import LoadingGuide from './pages/LoadingGuide';
import InputFieldGuide from './pages/InputFieldGuide';
import ContextMenuGuide from './pages/ContextMenuGuide';
import ButtonGuide from './pages/ButtonGuide';
import TabsGuide from './pages/TabsGuide';
import ToastGuide from './pages/ToastGuide';
import SplashScreenGuide from './pages/SplashScreenGuide';

// Admin Portal Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminCombos from './pages/admin/AdminCombos';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSundaySale from './pages/admin/AdminSundaySale';
import AdminSale from './pages/admin/AdminSale';
import AdminSettings from './pages/admin/AdminSettings';

// Protected Admin Route Wrapper
function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, isVerifying, loading } = useAdminAuth();
  const isLoading = isVerifying || loading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#FFD400] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase font-bold tracking-widest text-[#FFD400]">
            Verifying Admin Security Clearance...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

// Scroll to top helper
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-navy-900 font-sans relative">
      <ScrollToTop />
      
      {/* 0. MOBILE LAUNCH SPLASH SCREEN */}
      {!isAdminRoute && <SplashScreen duration={1400} />}

      {/* ADMIN PORTAL SPECIAL LAYOUT */}
      {isAdminRoute ? (
        <main className="flex-1 bg-slate-50 text-slate-900">
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/edit/:id" element={<AdminProductForm />} />
              <Route path="combos" element={<AdminCombos />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="sunday-sale" element={<AdminSundaySale />} />
              <Route path="sale" element={<AdminSale />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </main>
      ) : (
        /* CUSTOMER STOREFRONT LAYOUT */
        <>
          {/* 1. SUNDAY SALE PROMO BANNER */}
          <SundaySaleBanner />

          {/* 2. TOP ANNOUNCEMENT BAR */}
          <AnnouncementBar />

          {/* 3. STICKY NAVBAR */}
          <Navbar />

          {/* 4. MAIN ROUTED VIEW */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/products" element={<Shop />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:category" element={<CategoryProducts />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/sale" element={<Sale />} />
              <Route path="/sunday-sale" element={<SundaySale />} />
              <Route path="/combos" element={<Combos />} />
              <Route path="/offers" element={<Offers />} />

              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Login />} />
              <Route path="/account" element={<AccountSettings />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/wishlist" element={<Wishlist />} />

              {/* Component & Design Guides */}
              <Route path="/design-tokens" element={<DesignTokensGuide />} />
              <Route path="/skeleton-guide" element={<SkeletonGuide />} />
              <Route path="/loading-guide" element={<LoadingGuide />} />
              <Route path="/input-guide" element={<InputFieldGuide />} />
              <Route path="/context-menu-guide" element={<ContextMenuGuide />} />
              <Route path="/button-guide" element={<ButtonGuide />} />
              <Route path="/tabs-guide" element={<TabsGuide />} />
              <Route path="/toast-guide" element={<ToastGuide />} />
              <Route path="/splash-guide" element={<SplashScreenGuide />} />

              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* 5. FOOTER */}
          <Footer />

          {/* 6. GLOBAL DRAWERS & FLOATING BUTTONS */}
          <CartDrawer />
          <Toast />
          <FloatingActions />
        </>
      )}
    </div>
  );
}
