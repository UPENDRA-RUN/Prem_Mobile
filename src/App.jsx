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

// Admin Pages & Protected Route
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSale from './pages/admin/AdminSale';
import AdminSundaySale from './pages/admin/AdminSundaySale';
import AdminSettings from './pages/admin/AdminSettings';


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
  const { isAuthenticated: isAdmin, admin, logout: adminLogout } = useAdminAuth();

  // --- ADMIN PORTAL RENDERING ---
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#050505] text-slate-100 font-sans">
        <ScrollToTop />
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/new" element={<AdminProductForm />} />
              <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/sale" element={<AdminSale />} />
              <Route path="/admin/sunday-sale" element={<Navigate to="/admin/sale" replace />} />
              <Route path="/admin/settings" element={<AdminSettings />} />


            </Route>
          </Route>
          
          <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </div>
    );
  }

  // --- CUSTOMER WEBSITE RENDERING ---
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-navy-900 font-sans">
      <ScrollToTop />

      {/* 0. ADMIN QUICK BAR (ONLY VISIBLE IF LOGGED IN AS ADMIN) */}
      {isAdmin && (
        <div className="bg-[#050505] text-[#ffd000] border-b border-[#ffd000]/40 px-4 py-1.5 text-xs flex items-center justify-between z-[1100] shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-black tracking-wider uppercase text-[11px] text-[#ffd000] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ffd000]" />
              <span>ADMINISTRATOR MODE</span>
            </span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              (Logged in as {admin?.email || 'admin@premmobile.com'})
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="px-3 py-1 rounded-md bg-[#ffd000] text-[#050505] font-black text-[11px] uppercase tracking-wider hover:bg-yellow-400 transition-colors shadow-xs"
            >
              Go to Admin Dashboard →
            </Link>
            <button
              onClick={adminLogout}
              className="text-slate-400 hover:text-white text-[11px] font-bold transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* SUNDAY SALE LIVE TOP BANNER */}
      <SundaySaleBanner />
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <AnnouncementBar />

      {/* 2. STICKY NAVBAR */}
      <Navbar />

      {/* 3. MAIN ROUTED VIEW */}
      <main className="flex-1">

        <Routes>
          {/* Customer Main Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Shop />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:category" element={<CategoryProducts />} />
          <Route path="/category/:category" element={<CategoryProducts />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/sale" element={<Sale />} />
          <Route path="/sunday-sale" element={<SundaySale />} />
          <Route path="/offers" element={<Offers />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/account" element={<AccountSettings />} />
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

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* 4. FOOTER */}
      <Footer />

      {/* 5. GLOBAL DRAWERS & FLOATING BUTTONS */}
      <CartDrawer />
      <Toast />
      <FloatingActions />
    </div>
  );
}
