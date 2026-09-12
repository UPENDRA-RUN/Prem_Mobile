import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { useAdminAuth } from './context/AdminAuthContext';

// Layout Components
import SundaySaleBanner from './components/layout/SundaySaleBanner';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingActions from './components/layout/FloatingActions';
import MobileBottomNav from './components/layout/MobileBottomNav';
import CartDrawer from './components/common/CartDrawer';
import CompareDrawer from './components/common/CompareDrawer';
import Toast from './components/common/Toast';
import SplashScreen from './components/common/SplashScreen';
import PwaInstallPrompt from './components/common/PwaInstallPrompt';

// Main Customer Pages (Eager or Lazy)
import Home from './pages/Home';
import Shop from './pages/Shop';

// Lazy Loaded Secondary Customer Pages
const Categories = lazy(() => import('./pages/Categories'));
const CategoryProducts = lazy(() => import('./pages/CategoryProducts'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Offers = lazy(() => import('./pages/Offers'));
const About = lazy(() => import('./pages/About'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Login = lazy(() => import('./pages/Login'));
const AccountSettings = lazy(() => import('./pages/AccountSettings'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Compare = lazy(() => import('./pages/Compare'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Sale = lazy(() => import('./pages/Sale'));
const SundaySale = lazy(() => import('./pages/SundaySale'));
const Combos = lazy(() => import('./pages/Combos'));
const Orders = lazy(() => import('./pages/Orders'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy Loaded Developer & Design Guides
const DesignTokensGuide = lazy(() => import('./pages/DesignTokensGuide'));
const SkeletonGuide = lazy(() => import('./pages/SkeletonGuide'));
const LoadingGuide = lazy(() => import('./pages/LoadingGuide'));
const InputFieldGuide = lazy(() => import('./pages/InputFieldGuide'));
const ContextMenuGuide = lazy(() => import('./pages/ContextMenuGuide'));
const ButtonGuide = lazy(() => import('./pages/ButtonGuide'));
const TabsGuide = lazy(() => import('./pages/TabsGuide'));
const ToastGuide = lazy(() => import('./pages/ToastGuide'));
const SplashScreenGuide = lazy(() => import('./pages/SplashScreenGuide'));

// Lazy Loaded Admin Portal Pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));
const AdminCombos = lazy(() => import('./pages/admin/AdminCombos'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminSundaySale = lazy(() => import('./pages/admin/AdminSundaySale'));
const AdminSale = lazy(() => import('./pages/admin/AdminSale'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));

// Page loading fallback spinner
function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-8">
      <div className="w-10 h-10 border-4 border-[#FFD400] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

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
    return <Navigate to="/login" replace />;
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
          <Suspense fallback={<PageLoader />}>
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
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="reviews" element={<AdminReviews />} />
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
          </Suspense>
        </main>
      ) : (
        /* CUSTOMER STOREFRONT LAYOUT */
        <>
          {/* 1. SUNDAY SALE PROMO BANNER */}
          <SundaySaleBanner />

          {/* 2. STICKY NAVBAR */}
          <Navbar />

          {/* 4. MAIN ROUTED VIEW */}
          <main className="flex-1 pb-16 lg:pb-0">
            <Suspense fallback={<PageLoader />}>
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
                <Route path="/contact" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Login />} />
                <Route path="/account" element={<AccountSettings />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/compare" element={<Compare />} />

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
            </Suspense>
          </main>

          {/* 5. FOOTER */}
          <Footer />

          {/* 6. GLOBAL DRAWERS & FLOATING BUTTONS */}
          <CartDrawer />
          <CompareDrawer />
          <Toast />
          <FloatingActions />
          <MobileBottomNav />
          <PwaInstallPrompt />
        </>
      )}
    </div>
  );
}
